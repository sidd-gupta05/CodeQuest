//components/landingPage/HeroSection.tsx  
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Navbar from '@/components/navbar';

export default function HeroSection() {
  return (
    <>
      <main
        style={{
          background:
            'linear-gradient(180deg, #05303B -14.4%, #2B7C7E 11.34%, #91D8C1 55.01%, #FFF 100%)',
        }}
      >
        <Navbar />
        <section className="flex flex-col items-center justify-center px-6 lg:px-24 py-12 gap-12">
          <div className="flex flex-col items-center select-none pointer-events-none">
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

            <p
              className="mt-6 text-black text-md md:text-lg text-center"
              style={{ fontFamily: 'Lufga SemiBold, Urbanist, sans-serif' }}
            >
              Book lab tests online, get accurate reports fast, and track
              everything in one secure platform
              <br />
              <strong>NO queues, no confusion</strong>
            </p>
          </div>

          <Link
            href={'/auth/sign_in'}
            className="inline-block bg-[#2B7C7E] hover:bg-[#1f5d5f] text-white py-3 px-8 rounded-full text-xl font-semibold shadow-lg transition-all duration-300 hover:shadow-2xl mx-auto mb-10 transform hover:scale-110 select-none"
          >
            Get Started
          </Link>

          <div
            className="absolute bottom-[-435px] left-1/2 z-10 w-full h-[200px] bg-gray-200 border border-gray-300 hidden md:block select-none pointer-events-none"
            style={{
              transform: 'translateX(-50%) perspective(800px) rotateX(50deg)',
              transformOrigin: 'bottom',
            }}
          />
          <div className="relative w-full max-w-lg mx-auto select-none pointer-events-none">
            <Image
              src="/iphone.svg"
              alt="Labsphere App"
              width={500}
              height={500}
              className="w-full relative z-20"
            />

            {/* Stats Box */}
            <div className="absolute top-1/100 right-2 sm:right-4 md:right-[-250px] bg-white/10 backdrop-blur-3xl text-white text-2xl sm:text-3xl md:text-6xl lg:text-7xl font-extrabold px-3 sm:px-4 md:px-8 lg:px-10 py-3 sm:py-4 md:py-6 rounded-2xl border-2 border-white shadow-lg w-60 sm:w-72 md:w-96 h-[130px] sm:h-[160px] md:h-[200px] flex flex-col items-center justify-center text-center leading-none z-30 animate-[bounce_2.5s_infinite]">
              <span className="text-white drop-shadow-3xl font-clash-semibold">
                1000+
              </span>
              <span className="text-white text-base sm:text-xl md:text-3xl lg:text-5xl font-semibold drop-shadow-3xl">
                labs enlisted
              </span>
            </div>

            {/* Calendar */}
            <div className="absolute left-[-20px] sm:left-[400px] md:left-[-340px] bottom-[10px] z-20">
              <Image
                src="/calendar.png"
                alt="Calendar"
                width={470}
                height={200}
                className="w-40 sm:w-60 md:w-[470px]"
              />
            </div>

            {/* Floating Info Card */}
            <div className="absolute top-[25%] sm:top-[10%] left-2 sm:left-[-100px] md:left-[-350px] bg-white text-black px-4 py-2 rounded-lg shadow-md w-[280px] sm:w-[320px] text-sm flex flex-col gap-1 z-30">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  10:00–13:00
                </div>
                <button className="text-gray-400 hover:text-gray-600 text-xl leading-none cursor-pointer">
                  ⋯
                </button>
              </div>

              <div
                className="text-sm sm:text-base text-black"
                style={{ fontFamily: 'Lufga, Urbanist, sans-serif' }}
              >
                Design new UX flow for Michael
              </div>

              <div
                className="text-gray-500 text-xs sm:text-sm"
                style={{ fontFamily: 'Lufga, Urbanist, sans-serif' }}
              >
                Start from screen 16
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
