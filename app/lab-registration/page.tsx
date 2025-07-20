"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LabRegistration() {
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
            {/* Lab Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lab Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your location"
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

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-teal-600 text-white rounded-md py-2 font-semibold flex items-center justify-center gap-2 cursor-pointer"
            >
              Verify <span>→</span>
            </button>
          </form>

          {/* OR Separator */}
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="mx-2 text-gray-400 text-sm">OR</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          {/* Social Buttons */}
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

          {/* Already have account */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <a href="#" className="text-teal-600 font-medium">
              Log in
            </a>
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div
        className="flex items-center justify-center p-10"
        style={{
          background: "linear-gradient(180deg, #05303B 0%, #2B7C7E 100%)",
        }}
      >
        <div className="text-center text-white max-w-md">
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
