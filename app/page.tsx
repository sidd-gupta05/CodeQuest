"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main
      className="min-h-screen flex flex-col text-white"
      style={{
        background:
          "linear-gradient(180deg, #05303B -14.4%, #2B7C7E 11.34%, #91D8C1 55.01%, #FFF 100%)",
      }}
    >
      <nav className="backdrop-blur-md bg-gradient-to-r from-[#1e5f61]/60 to-[#0c2d34]/60 border border-white/20 rounded-full px-6 py-2 mx-auto mt-6 max-w-[95%] shadow-lg w-full flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-2 min-w-[120px]">
          <Link
            href="/"
            className="text-white font-semibold flex items-center gap-2"
          >
            <Image
              src="/logo2.svg"
              alt="Labsphere Logo"
              width={20}
              height={20}
              className="w-7 h-7"
            />
            Labsphere
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <ul className="hidden md:flex gap-8 text-white font-medium text-base justify-center flex-1">
          <li>
            <Link href="/#" className="hover:text-teal-300 transition">
              Book Appointment
            </Link>
          </li>
          <li>
            <Link href="/#" className="hover:text-teal-300 transition">
              Track report
            </Link>
          </li>
          <li>
            <Link href="/#" className="hover:text-teal-300 transition">
              Pricing
            </Link>
          </li>
          <li>
            <Link href="/#" className="hover:text-teal-300 transition">
              Contact Us
            </Link>
          </li>
        </ul>

        {/* Right: Sign Up */}
        <div className="min-w-[120px] flex justify-end">
          <Link
            href="/optionss"
            className="text-white font-semibold px-4 py-1.5 border border-white/30 rounded-full hover:bg-white/10 transition"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-6 lg:px-24 py-12 gap-12">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-center flex flex-wrap justify-center gap-2">
            <span className="text-white">Your</span>
            <span className="bg-white/20 text-white px-4 py-1 rounded-full backdrop-blur-md font-semibold">
              Health
            </span>
            <span className="text-white">Deserves Speed</span>
          </h1>
          <p className="text-white text-4xl md:text-5xl font-bold text-center mt-4">
            Precision & Simplicity
          </p>

          <p className="mt-6 text-black text-md md:text-lg font-semibold text-center">
            Book lab tests online, get accurate reports fast, and track
            everything in one secure platform
            <br />
            <strong>NO queues, no confusion</strong>
          </p>
        </div>
      </section>

      {/* Right Content */}
      {/* <div className="relative w-full max-w-lg mx-auto">
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-0 opacity-60 hidden sm:block">
        <Image
        src="/table-bg.png" // Make sure this is the table image you uploaded
        alt="Table Background"
        width={700}
        height={400}
        className="w-[600px] md:w-[700px] lg:w-[800px] opacity-40"
        />
        </div>
        <Image
        src="/iphone.svg"
        alt="Labsphere App"
        width={5}
        height={5}
        className="w-full"
        />
        
        <div className="absolute top-1/100 right-2 sm:right-4 md:right-[-250px] bg-white/10 backdrop-blur-xs text-white text-2xl sm:text-3xl md:text-6xl lg:text-7xl font-extrabold px-3 sm:px-4 md:px-8 lg:px-10 py-3 sm:py-4 md:py-6 rounded-[32px] border-2 border-white shadow-lg w-60 sm:w-72 md:w-96 h-[130px] sm:h-[160px] md:h-[200px] flex flex-col items-center justify-center text-center leading-none ">
        <span className="text-white drop-shadow-3xl">1000+</span>
        <span className="text-white text-base sm:text-xl md:text-3xl lg:text-5xl font-semibold drop-shadow-3xl">
        labs enlisted
        </span>
        </div>
        
        <div className="absolute left-[-20px] sm:left-[400px] md:left-[-370px] bottom-[-20px] ">
        <Image
        src="/calendar.png"
        alt="Calendar"
        width={200}
        height={200}
        className="w-40 sm:w-60 md:w-[470px]"
        />
        </div>
        
        <div className="absolute top-[20%] left-2 sm:left-[-100px] md:left-[-350px] bg-white text-black px-4 py-2 rounded-lg shadow-md w-[280px] sm:w-[320px] text-sm flex flex-col gap-1">
        <div className="flex justify-between items-start">
        <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        10:00–13:00
        </div>
        <button className="text-gray-400 hover:text-gray-600 text-xl leading-none cursor-pointer">
        ⋯
        </button>
        </div>
        
        <div className="font-semibold text-sm sm:text-base text-black">
        Design new UX flow for Michael
        </div>
        
        <div className="text-gray-500 text-xs sm:text-sm">
        Start from screen 16
        </div>
        </div>
        </div> */}

      <div
        className="absolute bottom-[-264px] left-1/2 z-10 w-full h-[200px] bg-gray-200 shadow-md border border-gray-300 hidden md:block"
        style={{
          transform: "translateX(-50%) perspective(800px) rotateX(50deg)",
          transformOrigin: "bottom",
        }}
      />
      <div className="relative w-full max-w-lg mx-auto">
        {/* Realistic table design */}
        {/* Mobile mockup (placed above the table) */}
        <Image
          src="/iphone.svg"
          alt="Labsphere App"
          width={5}
          height={5}
          className="w-full relative z-20"
        />

        {/* Stats Box */}
        <div className="absolute top-1/100 right-2 sm:right-4 md:right-[-250px] bg-white/10 backdrop-blur-xs text-white text-2xl sm:text-3xl md:text-6xl lg:text-7xl font-extrabold px-3 sm:px-4 md:px-8 lg:px-10 py-3 sm:py-4 md:py-6 rounded-[32px] border-2 border-white shadow-lg w-60 sm:w-72 md:w-96 h-[130px] sm:h-[160px] md:h-[200px] flex flex-col items-center justify-center text-center leading-none z-30">
          <span className="text-white drop-shadow-3xl">1000+</span>
          <span className="text-white text-base sm:text-xl md:text-3xl lg:text-5xl font-semibold drop-shadow-3xl">
            labs enlisted
          </span>
        </div>

        {/* Calendar */}
        <div className="absolute left-[-20px] sm:left-[400px] md:left-[-370px] bottom-[-20px] z-20">
          <Image
            src="/calendar.png"
            alt="Calendar"
            width={200}
            height={200}
            className="w-40 sm:w-60 md:w-[470px]"
          />
        </div>

        {/* Floating Info Card */}
        <div className="absolute top-[20%] left-2 sm:left-[-100px] md:left-[-350px] bg-white text-black px-4 py-2 rounded-lg shadow-md w-[280px] sm:w-[320px] text-sm flex flex-col gap-1 z-30">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              10:00–13:00
            </div>
            <button className="text-gray-400 hover:text-gray-600 text-xl leading-none cursor-pointer">
              ⋯
            </button>
          </div>

          <div className="font-semibold text-sm sm:text-base text-black">
            Design new UX flow for Michael
          </div>

          <div className="text-gray-500 text-xs sm:text-sm">
            Start from screen 16
          </div>
        </div>
      </div>
    </main>
  );
}
