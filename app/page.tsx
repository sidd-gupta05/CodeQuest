"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="w-full flex items-center justify-between px-6 py-4 border-b shadow-sm">
        {/* Labsphere Logo */}
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Labsphere Logo" width={50} height={50} />
          <span className="text-xl font-bold text-gray-800">Labsphere</span>
        </div>

        {/* Login Button */}
        <button
          onClick={() => router.push("/optionss")}
          className="px-5 py-2 bg-teal-600 text-white rounded-full font-semibold hover:bg-teal-700 transition"
        >
          Login
        </button>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-grow px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Welcome to Labsphere
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-2xl">
          Your all-in-one platform for managing laboratories, patient records,
          diagnostics, and more.
        </p>

        <div className="mt-8 flex flex-col md:flex-row gap-4">
          <button
            onClick={() => router.push("/optionss")}
            className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition"
          >
            Get Started
          </button>
        </div>
      </section>
    </main>
  );
}
