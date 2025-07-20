"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DoctorRegistration() {
  const router = useRouter();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
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

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Practicing Location
              </label>
              <input
                type="text"
                placeholder="Enter your location"
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
              type="submit"
              className="w-full bg-teal-600 text-white rounded-md py-2 font-semibold cursor-pointer"
            >
              Verify →
            </button>
          </form>

          {/* Social Sign-in Buttons */}
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="mx-2 text-gray-400 text-sm">OR</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          <div className="flex gap-4 justify-center">
            <button className="p-2 border rounded-full cursor-pointer">
              <Image
                src="/facebook.svg"
                alt="Facebook"
                width={24}
                height={24}
              />
            </button>
            <button className="p-2 border rounded-full cursor-pointer">
              <Image src="/google.svg" alt="Google" width={24} height={24} />
            </button>
            <button className="p-2 border rounded-full cursor-pointer">
              <Image src="/apple.svg" alt="Apple" width={24} height={24} />
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <a href="#" className="text-teal-600">
              Log in
            </a>
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div
        className="flex items-center justify-center p-10"
        style={{
          background:
            "linear-gradient(26.61deg, #05303B 0.93%, #2B7C7E 101.37%)",
        }}
      >
        <div className="text-center text-white max-w-md ">
          <Image
            src="/doctor-registration-illustration.svg"
            alt="Doctor Illustration"
            width={750}
            height={850}
            className="mx-auto hidden md:block"
          />
        </div>
      </div>
    </div>
  );
}
