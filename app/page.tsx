'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const router = useRouter();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  const [startCount, setStartCount] = useState(false);

  useEffect(() => {
    if (inView) setStartCount(true);
  }, [inView]);

  return (
    <>
      <main
        className="min-h-screen flex flex-col text-white"
        style={{
          background:
            'linear-gradient(180deg, #05303B -14.4%, #2B7C7E 11.34%, #91D8C1 55.01%, #FFF 100%)',
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

        <div
          className="absolute bottom-[-264px] left-1/2 z-10 w-full h-[200px] bg-gray-200 shadow-2xl border border-gray-300 hidden md:block"
          style={{
            transform: 'translateX(-50%) perspective(800px) rotateX(50deg)',
            transformOrigin: 'bottom',
          }}
        />
        <div className="relative w-full max-w-lg mx-auto">
          <Image
            src="/iphone.svg"
            alt="Labsphere App"
            width={5}
            height={5}
            className="w-full relative z-20"
          />

          {/* Stats Box */}
          <div className="absolute top-1/100 right-2 sm:right-4 md:right-[-250px] bg-white/10 backdrop-blur-3xl text-white text-2xl sm:text-3xl md:text-6xl lg:text-7xl font-extrabold px-3 sm:px-4 md:px-8 lg:px-10 py-3 sm:py-4 md:py-6 rounded-[32px] border-2 border-white shadow-lg w-60 sm:w-72 md:w-96 h-[130px] sm:h-[160px] md:h-[200px] flex flex-col items-center justify-center text-center leading-none z-30 animate-bounce">
            <span className="text-white drop-shadow-3xl">1000+</span>
            <span className="text-white text-base sm:text-xl md:text-3xl lg:text-5xl font-semibold drop-shadow-3xl">
              labs enlisted
            </span>
          </div>

          {/* Calendar */}
          <div className="absolute left-[-20px] sm:left-[400px] md:left-[-340px] bottom-[-20px] z-20">
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

      <div
        ref={ref}
        className="flex justify-center items-center bg-gray-100 w-full py-10"
      >
        <div className="flex flex-col sm:flex-row justify-between w-full max-w-5xl px-6 text-center ">
          <div>
            <h2 className="text-4xl font-extrabold text-black">
              {startCount && <CountUp end={10000} duration={2} separator="," />}
              +
            </h2>
            <p className="text-gray-600 mt-2">Tests Processed</p>
          </div>
          <div>
            <h2 className="text-4xl font-extrabold text-black">
              {startCount && <CountUp end={300} duration={2} />}+
            </h2>
            <p className="text-gray-600 mt-2">Verified Labs</p>
          </div>
          <div>
            <h2 className="text-4xl font-extrabold text-black">
              {startCount && <CountUp end={50} duration={2} />}+
            </h2>
            <p className="text-gray-600 mt-2">Cities Covered</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-10">
        <div className="grid grid-cols-3 gap-8 w-5/6 p-8">
          {/* Row 1 */}
          <div className="bg-white rounded-4xl p-6 shadow-2xl w-full max-w-md">
            {/* Top Section */}
            <div>
              <p className="text-sm font-bold text-[#2B7C7E] uppercase">
                Upgrade Discount
              </p>
              <h1 className="text-2xl font-semibold text-gray-900 mt-2">
                Simplify Lab Management
              </h1>
              <p className="text-gray-600 mt-1 text-sm">
                Manage bookings, reports & users in one place.
              </p>
              <h2 className="text-4xl font-bold text-[#2B7C7E] mt-3">₹499/-</h2>
            </div>

            {/* Divider */}
            <div className="border-t border-dashed my-4"></div>

            {/* Bottom Section */}
            <div className="">
              <div>
                <p className="flex justify-between items-center text-xs text-gray-600 font-medium">
                  DISCOUNT CODE <strong className=""> LABSPHERE20</strong>
                </p>
              </div>
              <Image src="/barcode.svg" alt="barcode" width={500} height={40} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#2B7C7E] to-[#91D8C1] rounded-4xl shadow-2xl p-4 flex flex-col justify-center">
            <h2 className="text-white font-bold text-lg leading-tight">
              Clean,
              <br />
              Accessible
              <br />
              UI
            </h2>
            <p className="text-white text-xs mt-2">
              Designed for doctors,
              <br />
              labs & patients.
            </p>
          </div>

          <div className="bg-white rounded-4xl p-4 shadow-2xl flex flex-col items-center justify-center">
            <p className="text-[#2B7C7E] text-sm font-semibold mb-2">
              Top Labs
              <br />
              at your doorstep
            </p>
            <Image
              src="/drlab.png"
              alt="Dr Lal"
              width={100}
              height={100}
              className="rounded-md"
            />
            <p className="text-xs mt-2 text-center">
              Dr Lal Path Lab
              <br />
              <span className="text-gray-500">Wadala, Mumbai</span>
            </p>
            <button className="mt-2 text-xs px-3 py-1 bg-[#2B7C7E] text-white rounded-full">
              Book Appointment
            </button>
          </div>

          {/* Row 2 */}
          <div className="bg-gradient-to-br from-[#2B7C7E] to-[#91D8C1] rounded-4xl shadow-2xl p-4 text-white text-5xl font-bold text-left relative overflow-hidden">
            {/* Background SVG: OutGuard */}
            <img
              src="/OutGuard.svg"
              alt="OutGuard"
              className="absolute bottom-0 right-0 w-44 h-44 opacity-70 [transform:rotate(360deg)]"
            />

            {/* Foreground SVG: InGuard */}
            <img
              src="/InGuard.svg"
              alt="InGuard"
              className="absolute bottom-0 right-0 w-40 h-40 opacity-100 [transform:rotate(360deg)] z-10"
            />

            <div className="relative z-20 py-4">
              <div className="mb-4">Secure.</div>
              <div className="mb-4">Scalable.</div>
              <div>Seamless.</div>
            </div>
          </div>

          <div className="bg-white rounded-4xl shadow-xl flex flex-col items-center justify-center p-6">
            <Image src="/logo.svg" alt="logo" width={120} height={120} />
            <div className="text-[#2B7C7E] text-5xl font-bold mt-4">
              Labsphere
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#2B7C7E] to-[#91D8C1] rounded-4xl p-4 shadow-2xl flex flex-col justify-center items-center text-white text-center">
            <h2 className="font-bold text-lg">Mobile Compatible</h2>
            <Image
              src="/iphone.svg"
              alt="iphone"
              width={150}
              height={200}
              className="my-2"
            />
          </div>

          {/* Row 3 */}
          <div className="col-span-3 grid grid-cols-4 gap-6 w-full">
            {/* Simple Dashboard - spans 2 columns */}
            <div className="col-span-2 bg-gradient-to-br from-[#2B7C7E] to-[#91D8C1] rounded-4xl p-4 shadow-2xl text-white">
              <h3 className="font-bold text-4xl mt-4">Simple Dashboard</h3>
              <div className="bg-white rounded-lg mt-4 p-4 text-left">
                <p className="text-3xl font-bold text-[#2B7C7E]">1000</p>
                <p className="text-xs text-gray-600">
                  New customers this month
                </p>
                <div className="w-full h-2 bg-gray-200 rounded mt-2">
                  <div
                    className="h-full bg-[#2B7C7E] rounded"
                    style={{ width: '80%' }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="col-span-1 bg-gradient-to-br from-[#2B7C7E] to-[#91D8C1] rounded-4xl p-4 shadow-2xl text-white text-center flex items-center justify-center">
              <p className="text-4xl font-bold">
                Your health
                <br />
                deserves speed
                <br />
                precision &<br />
                simplicity
              </p>
            </div>
            {/* Calendar Card - 1 column */}
            <div className="col-span-1 bg-white rounded-4xl p-4 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="text-xs text-gray-500">🟢 10:00 - 11:00</div>
                <p className="text-sm font-semibold mt-1">
                  Appointment for CBC at Siddharth's Place
                </p>
                <p className="text-xs text-gray-500">
                  Antop Hill, Wadala, Mumbai
                </p>
              </div>
              <Image
                src="/calendar.png"
                alt="calendar"
                width={250}
                height={120}
                className="mt-2 rounded-lg"
              />
            </div>

            {/* Your health - 1 column */}
          </div>
        </div>
      </div>
    </>
  );
}
