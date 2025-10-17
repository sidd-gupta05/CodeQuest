'use client';
import CarouselSection from '@/components/carousel-section';
import { supabase } from '@/utils/supabase/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

export default function LabRegistration() {
  const router = useRouter();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true); // 🔹 add loading state

  useEffect(() => {
    async function checkLab() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: lab } = await supabase
        .from('labs')
        .select('id')
        .eq('userId', user.id)
        .single();

      if (lab) {
        router.replace('/dashboard');
      } else {
        setLoading(false); // ✅ only stop loading when user can stay
      }
    }

    checkLab();
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  // 🔽 Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    console.log('Submitting form for user:', user?.id);

    localStorage.setItem('labId', user?.id || '');
    console.log('User data:', user?.id, user?.email, user?.role);
    if (error || !user) {
      console.error('No user found:', error?.message);
      return;
    }

    let certPath = '';

    if (uploadedFile) {
      const cleanFileName = uploadedFile.name.replace(/\s+/g, '_');
      const { data: fileData, error: fileError } = await supabase.storage
        .from('uploads')
        .upload(`lab-certificates/${user.id}/${cleanFileName}`, uploadedFile);

      if (fileError) {
        console.error('File upload error:', fileError.message);
        toast.error('Failed to upload certificate');
        return;
      }

      certPath = fileData.path;
    }

    const form = e.target as HTMLFormElement;
    const location = (form[0] as HTMLInputElement).value;
    const pnr = (form[1] as HTMLInputElement).value;

    const { error: insertError } = await supabase.from('labs').insert({
      id: uuidv4(),
      userId: user.id,
      labLocation: location,
      nablCertificateNumber: pnr,
      certificateUrl: certPath,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    if (insertError) {
      toast.error('Failed to submit registration');
      console.error('Insert error:', insertError.message);
      return;
    }

    // Set lab-registered cookie to true after successful registration
    document.cookie = `lab-registered=true; path=/; secure=${process.env.NODE_ENV === 'production'}; sameSite=strict`;

    toast.success(
      "Your application is being reviewed. You'll hear back within 2 days."
    );

    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex flex-col justify-center items-center my-auto">
          <div className="mx-auto">
            <img
              width={80}
              height={80}
              src="/dash-loading.gif"
              alt="Loading..."
            />
          </div>
          <div className="mt-2 text-center text-slate-700 font-semibold">
            Setting up your lab . . .
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 select-none ">
      {/* Left Section */}
      <div className="bg-white flex items-center justify-center p-10">
        <div className="max-w-md w-full flex flex-col justify-center">
          <Image
            className="mx-auto mb-6"
            src="/labsphere-icon.svg"
            alt="Labsphere Logo"
            width={300}
            height={60}
          />

          <button
            onClick={() => router.back()}
            className="text-gray-600 text-sm mb-4 flex items-center cursor-pointer"
          >
            ← Back
          </button>

          {/* 🔽 Add onSubmit to the form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Lab Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lab Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your location"
                  required
                  className="w-full border border-gray-300 rounded-md px-4 py-2 pl-10"
                />
              </div>
            </div>

            {/* NABL Certificate Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NABL Certificate No*
              </label>
              <input
                type="text"
                placeholder="Enter your NABL Certificate No."
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
            </div>

            {/* NABL Certificate Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NABL Certificate*
              </label>
              <label className="mt-1 border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer relative block hover:border-teal-600 transition">
                <input
                  type="file"
                  onChange={handleFileChange}
                  required
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center text-gray-600">
                  <p className="text-sm">Upload NABL certificate</p>
                </div>
              </label>
              {uploadedFile && (
                <div className="flex items-center justify-between mt-2 text-xs text-green-600">
                  <span>{uploadedFile.name} uploaded</span>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="ml-2 text-red-500 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* 🔽 Submit Button */}
            <button
              type="submit"
              className="w-full bg-teal-600 text-white rounded-md py-2 font-semibold flex items-center justify-center gap-2 cursor-pointer"
            >
              Verify <span>→</span>
            </button>
          </form>
        </div>
      </div>

      {/* Right Section */}
      <CarouselSection prop="/doctor-registration-illustration.webp" />
    </div>
  );
}
