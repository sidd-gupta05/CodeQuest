"use client";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4 py-12">
      <video
        src="/4042.webm"
        autoPlay
        loop
        muted
        playsInline
        className="w-full max-w-md sm:max-w-xl xl:max-w-3xl"
      />

      <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold text-gray-800 mt-8">
        Oops! Page Not Found
      </h1>

      <p className="mt-4 text-gray-600 text-base sm:text-lg xl:text-xl max-w-2xl">
        The page you're looking for doesn’t exist or has been moved. Let’s get
        you back on track!
      </p>

      <button
        onClick={() => router.push("/")}
        className="mt-6 px-6 py-3 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
      >
        Back to Homepage
      </button>
    </div>
  );
}
