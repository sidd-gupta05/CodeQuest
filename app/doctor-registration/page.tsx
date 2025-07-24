"use client";
import CarouselSection from "@/components/carousel-section";
import { supabase } from "@/utils/supabase/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function DoctorRegistration() {
  const router = useRouter();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/sign-in?redirectTo=/doctor-registration");
      }
    };

    checkAuth();
  }, [router]);

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    console.log("User data:", user?.id, user?.email, user?.role);
    if (error || !user) {
      console.error("No user found:", error?.message);
      return;
    }

    let certPath = "";

    if (uploadedFile) {
      const cleanFileName = uploadedFile.name.replace(/\s+/g, "_");
      const { data: fileData, error: fileError } = await supabase.storage
        .from("uploads")
        .upload(
          `doctor-certificates/${user.id}/${cleanFileName}`,
          uploadedFile
        );

      if (fileError) {
        console.error("File upload error:", fileError.message);
        alert("Failed to upload certificate");
        return;
      }

      certPath = fileData.path;
    }

    const form = e.target as HTMLFormElement;
    const location = (form[0] as HTMLInputElement).value;
    const pnr = (form[1] as HTMLInputElement).value;

    const { error: insertError } = await supabase.from("doctors").insert({
      id: uuidv4(), 
      userId: user.id,
      practicingLocation: location,
      prnNumber: pnr,
      certificateUrl: certPath,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    if (insertError) {
      alert("Failed to submit registration");
      console.error("Insert error:", insertError.message);
      return;
    }

    alert(
      "Your application is being reviewed. You’ll hear back within 2 days."
    );
    // router.push("/app/verify-pending"); // optional "waiting" screen

    // Optional: Validate fields here before redirect

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
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

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Practicing Location
              </label>
              <input
                type="text"
                placeholder="Enter your location"
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PNR No*
              </label>
              <input
                type="text"
                placeholder="Enter your PNR No."
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registration Certificate*
              </label>
              <label className="mt-1 border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer relative block hover:border-teal-600 transition">
                <input
                  type="file"
                  onChange={handleFileChange}
                  required
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mb-2 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v9m0 0l-3-3m3 3l3-3m0-9a3 3 0 00-6 0v3"
                    />
                  </svg>
                  <p className="text-sm text-gray-600">
                    Upload registration certificate
                  </p>
                </div>
              </label>
              {uploadedFile && (
                <div className="flex items-center justify-between mt-2 text-xs text-green-600">
                  <span>{uploadedFile.name} uploaded</span>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="ml-2 text-red-500 cursor-pointer "
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <button
              // TODO: Add form submission logic
              type="submit"
              className="w-full bg-teal-600 text-white rounded-md py-2 font-semibold cursor-pointer"
            >
              Verify →
            </button>
          </form>
        </div>
      </div>

      {/* Right Section */}
      <CarouselSection prop="/doctor-registration-illustration.webp" />
    </div>
  );
}
