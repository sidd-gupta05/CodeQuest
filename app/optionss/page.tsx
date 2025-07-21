"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OptionsPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState("");

  return (
    <>
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
        <style jsx global>{`
          @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");
          body {
            font-family: "Inter", sans-serif;
          }
        `}</style>

        {/* Left side - Signup form */}
        <div className="bg-white flex items-center justify-center p-10 ">
          <div className="max-w-md w-full flex flex-col justify-center">
            <div className="mb-6 text-center">
              <Image
                className="mx-auto mb-4"
                src="/labsphere-icon.svg"
                alt="Labsphere Logo"
                width={307}
                height={111}
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "/labsphere-icon.svg";
                }}
              />
            </div>

            <div className="mb-6">
              <label className="block text-teal-600 text-xl text-center font-semibold mb-2">
                Choose Account Type
              </label>
              <div className="flex justify-around space-x-2">
                <button
                  className={`flex-1 flex flex-col items-center p-4 rounded-lg shadow-sm transition-all duration-200 cursor-pointer ${
                    accountType === "doctor"
                      ? "bg-teal-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => {
                    setAccountType("doctor");
                    localStorage.setItem("accountType", "doctor"); // Store selection
                    router.push("/auth/sign_in");
                  }}
                >
                  <span
                    className={`text-2xl mb-1 ${
                      accountType === "doctor" ? "text-white" : "text-teal-600"
                    }`}
                  >
                    &#x2695;
                  </span>
                  <span className="text-sm font-medium">Doctor</span>
                </button>

                <button
                  className={`flex-1 flex flex-col items-center p-4 rounded-lg shadow-sm transition-all duration-200 cursor-pointer ${
                    accountType === "patient"
                      ? "bg-teal-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => {
                    setAccountType("patient");
                    localStorage.setItem("accountType", "patient"); // Store selection
                    router.push("/auth/sign_in");
                  }}
                >
                  <span
                    className={`text-2xl mb-1 ${
                      accountType === "patient" ? "text-white" : "text-teal-600"
                    }`}
                  >
                    &#x1F464;
                  </span>
                  <span className="text-sm font-medium">Patient</span>
                </button>

                <button
                  className={`flex-1 flex flex-col items-center p-4 rounded-lg shadow-sm transition-all duration-200 cursor-pointer ${
                    accountType === "lab"
                      ? "bg-teal-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => {
                    setAccountType("lab");
                    localStorage.setItem("accountType", "lab"); // Store selection
                    router.push("/auth/sign_in");
                  }}
                >
                  <span
                    className={`text-2xl mb-1 ${
                      accountType === "lab" ? "text-white" : "text-teal-600"
                    }`}
                  >
                    &#x1F3D8;
                  </span>
                  <span className="text-sm font-medium">Lab</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Illustration and carousel */}
        <div
          className="flex items-center justify-center p-10"
          style={{
            background:
              "linear-gradient(26.61deg, #05303B 0.93%, #2B7C7E 101.37%)",
          }}
        >
          <div className="text-center max-w-lg text-white pt-1">
            <Image
              src="/doctor-desk.webp"
              alt="Doctor at desk"
              width={750}
              height={850}
              className="mx-auto mb-6 hidden md:block"
            />
          </div>
        </div>
      </div>
    </>
  );
}
