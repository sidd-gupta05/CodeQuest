"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

export default function SignupPage() {
  const [accountType, setAccountType] = useState("patient");

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
            <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
      {/* Left side - Signup form */}
      <div className="bg-white flex items-center justify-center p-10 ">
        <div className="max-w-md w-full flex flex-col justify-center">
          <div className="mb-6 text-center">
            <Image className="mx-auto mb-4"
            src="/labsphere-icon.svg" alt="Labsphere Logo" width={307} height={111} 
              onError={(e) => { e.target.onerror :  = null; e.target.src="/labsphere-icon.svg"}} />
             <h2 className="text-3xl font-semibold text-gray-800 mb-2">Create an account</h2>
            <p className="text-gray-600 mt-2">Start your 30 days free trial</p>
          </div>

          
          {/* Account Type Selection */}
          <div className="mb-6">
            <label className="block text-teal-600 text-xl text-center font-semibold mb-2">Choose Account Type</label>
            <div className="flex justify-around space-x-2">
              {/* Doctor Button */}
              <button
                className={`flex-1 flex flex-col items-center p-4 rounded-lg shadow-sm transition-all duration-200 ${
                  accountType === 'doctor' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setAccountType('doctor')}
              >
                <span className={`text-2xl mb-1 ${accountType === 'doctor' ? 'text-white' : 'text-teal-600'}`}>&#x2695;</span> {/* Caduceus icon */}
                <span className="text-sm font-medium">Doctor</span>
              </button>
              {/* Patient Button */}
              <button
                className={`flex-1 flex flex-col items-center p-4 rounded-lg shadow-sm transition-all duration-200 ${
                  accountType === 'patient' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setAccountType('patient')}
              >
                <span className={`text-2xl mb-1 ${accountType === 'patient' ? 'text-white' : 'text-teal-600'}`}>&#x1F464;</span> {/* Person icon */}
                <span className="text-sm font-medium">Patient</span>
              </button>
              {/* Lab Button */}
              <button
                className={`flex-1 flex flex-col items-center p-4 rounded-lg shadow-sm transition-all duration-200 ${
                  accountType === 'lab' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setAccountType('lab')}
              >
                <span className={`text-2xl mb-1 ${accountType === 'lab' ? 'text-white' : 'text-teal-600'}`}>&#x1F3D8;</span> {/* Building icon */}
                <span className="text-sm font-medium">Lab</span>
              </button>
            </div>
          </div>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
            <input
              type="email"
              placeholder="Enter your e-mail"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
            <p className="text-xs text-gray-500">Must be at least 8 characters.</p>
            <button
              type="button"
              className="w-full bg-teal-600 text-white rounded-md py-2 font-semibold"
            >
              Next
            </button>
          </form>

          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="mx-2 text-gray-400 text-sm">OR</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          <div className="flex gap-4 justify-center">
            <button className="p-2 border rounded-full"
            onClick={() => signIn('google')}>
              <Image src="/google.svg" alt="Google" width={24} height={24} />
            </button>
            <button className="p-2 border rounded-full">
              <Image src="/facebook.svg" alt="Facebook" width={24} height={24} />
            </button>
            <button className="p-2 border rounded-full">
              <Image src="/apple.svg" alt="Apple" width={24} height={24} />
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account? <a href="#" className="text-teal-600">Log in</a>
          </p>
        </div>
      </div>

      {/* Right side - Illustration and carousel */}
      <div className="flex items-center justify-center p-10 "
      style={{ background: 'linear-gradient(26.61deg, #05303B 0.93%, #2B7C7E 101.37%)' }}>
        <div className="text-center max-w-lg text-white pt-1">
          <Image
            src="/doctor-desk.svg" // Replace with actual image or static path
            alt="Doctor at desk"
            width={750}
            height={850}
            className="mx-auto mb-6"
          />
        </div>
      </div>
    </div>
  );
}
