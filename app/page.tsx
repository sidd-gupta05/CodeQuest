'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { useState, useEffect } from 'react';

// use below for applying font to all children in e.g className={`font-clash-semibold`}
import {  urbanistFontBold, urbanistFontRegular } from './fonts';
// use below line to import custom styles for inline stlye={}
import '@/public/css/lufga.css';
import '@/public/css/clash-display.css'

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  UserPlus,
  Calendar,
  FileText,
  Tag,
} from 'lucide-react';

const labs = [
  { name: 'Dr Lal Path Lab', location: 'Wadala, Mumbai', image: '/drlab.png' },
  { name: 'Dr Lal Path Lab', location: 'Wadala, Mumbai', image: '/drlab1.png' },
  { name: 'Dr Lal Path Lab', location: 'Wadala, Mumbai', image: '/drlab2.png' },
  { name: 'Dr Lal Path Lab', location: 'Wadala, Mumbai', image: '/drlab3.png' },
  { name: 'Dr Lal Path Lab', location: 'Wadala, Mumbai', image: '/drlab4.png' },
];

// const steps = [
//   {
//     title: 'Register / Login',
//     description:
//       'Patients can login and signup to LabSphere for accessing all lab services easily.',
//   },
//   {
//     title: 'Book Lab Test',
//     description:
//       'Book appointments with nearby labs according to available time slots for convenience.',
//   },
//   {
//     title: 'Track Reports',
//     description:
//       'Track your report status. Receive reports directly on your phone, even urgently if required.',
//   },
//   {
//     title: 'Affordable Pricing',
//     description:
//       'Get discounts and affordable lab test prices through LabSphere.',
//   },
// ];

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0,
  }),
};

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

  // const [step, setStep] = useState(1);

  // const handleStepChange = (nextStep: number) => {
  //   setStep(nextStep);
  // };

  // const [step, setStep] = useState(0);
  // const [direction, setDirection] = useState(0); // +1 for next, -1 for prev

  // const handleNext = () => {
  //   if (step < steps.length - 1) {
  //     setDirection(1);
  //     setStep((prev) => prev + 1);
  //   }
  // };

  // const handlePrevious = () => {
  //   if (step > 0) {
  //     setDirection(-1);
  //     setStep((prev) => prev - 1);
  //   }
  // };

  const [currentIndex, setCurrentIndex] = useState(0);

  const features = [
    {
      icon: <UserPlus className="w-16 h-16 text-blue-500" />,
      title: 'Register & Login',
      description:
        'Patients can easily sign up and log in to LabSphere to manage their health profile and appointments seamlessly.',
      bgColor: 'bg-blue-50',
    },
    {
      icon: <Calendar className="w-16 h-16 text-green-500" />,
      title: 'Book Lab Tests',
      description:
        'Book appointments at nearby path labs at your convenience. Our easy-to-use system helps you find a time that works for you.',
      bgColor: 'bg-green-50',
    },
    {
      icon: <FileText className="w-16 h-16 text-purple-500" />,
      title: 'Track Your Reports',
      description:
        'Keep track of your lab reports in real-time. Get urgent reports delivered directly to your phone through the LabSphere platform.',
      bgColor: 'bg-purple-50',
    },
    {
      icon: <Tag className="w-16 h-16 text-red-500" />,
      title: 'Discounts & Best Prices',
      description:
        'Take advantage of exclusive discounts and competitive pricing on a wide range of lab tests, making healthcare more affordable.',
      bgColor: 'bg-red-50',
    },
  ];

  // Function to go to the next slide
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % features.length);
  };

  // Function to go to the previous slide
  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + features.length) % features.length
    );
  };

  const cardVariants = {
    offscreen: {
      x: -100,
      opacity: 0,
    },
    onscreen: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        bounce: 0.4,
        duration: 0.8,
      },
    },
    exit: {
      x: 100,
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
  } as const;

  return (
    <>
      <main
        className={`min-h-screen flex flex-col text-white $`}
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
        <section className={` flex flex-col items-center  justify-center px-6 lg:px-24 py-12 gap-12`}>
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

            <p className="mt-6 text-black text-md md:text-lg text-center" style={{ fontFamily: 'Lufga SemiBold, Urbanist, sans-serif' }}>
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
          <div className="absolute top-1/100 right-2 sm:right-4 md:right-[-250px] bg-white/10 backdrop-blur-3xl text-white text-2xl sm:text-3xl md:text-6xl lg:text-7xl font-extrabold px-3 sm:px-4 md:px-8 lg:px-10 py-3 sm:py-4 md:py-6 rounded-2xl border-2 border-white shadow-lg w-60 sm:w-72 md:w-96 h-[130px] sm:h-[160px] md:h-[200px] flex flex-col items-center justify-center text-center leading-none z-30 animate-bounce">
            <span className="text-white drop-shadow-3xl font-clash-semibold">1000+</span>
            <span className="text-white text-base sm:text-xl md:text-3xl lg:text-5xl font-semibold drop-shadow-3xl">
              labs enlisted
            </span>
          </div>

          {/* Calendar */}
          <div className="absolute left-[-20px] sm:left-[400px] md:left-[-340px] bottom-[10px] z-20">
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

            <div className="text-sm sm:text-base text-black" style={{ fontFamily: 'Lufga, Urbanist, sans-serif' }}>
              Design new UX flow for Michael
            </div>

            <div className="text-gray-500 text-xs sm:text-sm" style={{ fontFamily: 'Lufga, Urbanist, sans-serif' }}>
              Start from screen 16
            </div>
          </div>
        </div>
      </main>

      <div
        ref={ref}
        className="flex justify-center items-center bg-white w-full py-10 "
      >
        <div className="flex flex-col sm:flex-row justify-between w-full max-w-5xl px-6 text-center "
        style={{ fontFamily: 'ClashDisplay-Medium, Urbanist, sans-serif' }}>
          <div>
            <h2 className="text-5xl font-extrabold text-black" style={{ fontFamily: 'Lufga SemiBold, Urbanist, sans-serif' }}>
              {startCount && <CountUp end={10000} duration={2} separator="," />}
              +
            </h2>
            <p
              className={`text-[#363D4F] text-3xl mt-2 `}
            >
              Tests Processed
            </p>
          </div>
          <div>
            <h2 className="text-5xl font-extrabold text-black" style={{ fontFamily: 'Lufga SemiBold, Urbanist, sans-serif' }}>
              {startCount && <CountUp end={300} duration={2} />}+
            </h2>
            <p
              className={`text-[#363D4F] mt-2 text-3xl `}
            >
              Verified Labs
            </p>
          </div>
          <div>
            <h2 className="text-5xl font-extrabold text-black" style={{ fontFamily: 'Lufga SemiBold, Urbanist, sans-serif' }}>
              {startCount && <CountUp end={50} duration={2} />}+
            </h2>
            <p
              className={`text-[#363D4F] text-3xl mt-2 `}
            >
              Cities Covered
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#E9EBF1]"  style={{ fontFamily: 'Urbanist, sans-serif' }}>
        <div className="flex items-center justify-center p-10">
          <div className="grid grid-cols-3 gap-8 w-5/6 p-8">
            <div>
              {/* Row 1 */}
              {/* Row 1 */}
              <div className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md">
                {/* Top Section */}
                <div>
                  <p className={`text-sm text-[#2B7C7E] uppercase ${urbanistFontBold.className}`}>
                    Upgrade Discount
                  </p>
                  <h1 className="text-2xl font-semibold text-gray-900 mt-2">
                    Simplify Lab Management
                  </h1>
                  <p className={`text-gray-600 mt-1 text-md ${urbanistFontRegular.className}`}>
                    Manage bookings, reports & users in one place.
                  </p>
                  <h2 className={`text-4xl font-bold text-[#2B7C7E] mt-3 ${urbanistFontBold.className}`}>
                    ₹499/-
                  </h2>
                </div>
              </div>
              {/* Divider */}
              <div className=" justify-center flex">
                <div className="border-t-2 w-11/12 border-dashed text-white"></div>
              </div>

              {/* Bottom Section */}
              <div className={`bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md ${urbanistFontBold.className}`}>
                <div>
                  <p className="flex justify-between items-center text-xs text-gray-600 ">
                    DISCOUNT CODE <strong className=""> LABSPHERE20</strong>
                  </p>
                </div>
                <Image
                  src="/barcode.svg"
                  alt="barcode"
                  width={500}
                  height={40}
                />
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
              <Image
                src="/OutGuard.svg"
                alt="OutGuard"
                width={44}
                height={44}
                className="absolute bottom-0 right-0 w-44 h-44 opacity-70 [transform:rotate(360deg)]"
              />

              {/* Foreground SVG: InGuard */}
              <Image
                src="/InGuard.svg"
                alt="InGuard"
                width={40}
                height={40}
                className="absolute bottom-0 right-0 w-40 h-40 opacity-100 [transform:rotate(360deg)] z-10"
              />

              <div className="relative z-20 py-4">
                <div className="mb-4">Secure.</div>
                <div className="mb-4">Scalable.</div>
                <div>Seamless.</div>
              </div>
            </div>

            <div className="bg-white rounded-4xl shadow-xl flex flex-col items-center justify-center p-6 w-full">
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

            <div className="col-span-3 grid grid-cols-4 gap-6 w-full">
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
              <div className="col-span-1 bg-white rounded-4xl p-4 shadow-2xl flex flex-col justify-between">
                <div>
                  <div className="text-xs text-gray-500">🟢 10:00 - 11:00</div>
                  <p className="text-sm font-semibold mt-1">
                    Appointment for CBC at Siddharth&apos;s Place
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
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center py-16 bg-[#E9EBF1] px-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-center text-[#0F2E2E] mb-8 sm:mb-12">
            Your nearby <span className="text-[#2B7C7E]">labs</span>
          </h2>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
            {labs.map((lab, index) => (
              <motion.div
                key={index}
                className="w-11/12 sm:w-[250px] rounded-3xl overflow-hidden shadow-md bg-[#91D8C1] p-[4px]"
                initial="offscreen"
                whileInView="onscreen"
                exit="exit"
                viewport={{ once: false, amount: 0.2 }}
                variants={cardVariants}
              >
                <div className="rounded-[22px] flex flex-col items-center bg-gradient-to-br from-[#2B7C7E] to-[#91D8C1]">
                  {/* Image placed on top without border box */}
                  <div className="relative w-full flex justify-center mt-6">
                    <div className="w-[120px] h-[150px] relative">
                      <Image
                        src={lab.image}
                        alt={lab.name}
                        fill
                        className="object-cover rounded-xl"
                      />
                    </div>
                  </div>

                  {/* White card part */}
                  <div className="bg-white rounded-2xl px-4 pt-6 pb-4 mx-4 mb-4 w-[calc(100%-32px)] text-center shadow-lg">
                    <div className="text-lg font-semibold text-[#0F2E2E] text-center">
                      {lab.name}
                    </div>
                    <div className="text-sm text-gray-500 text-center">
                      {lab.location}
                    </div>
                    <button className="mt-4 w-full bg-[#2B7C7E] text-white py-2 rounded-xl font-medium hover:bg-[#24686A] transition cursor-pointer">
                      Book Appointment
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center py-8 bg-[#E9EBF1] px-2">
        <h2 className="text-4xl sm:text-5xl font-bold text-center text-[#0F2E2E] mb-2 sm:mb-6">
          How <span className="text-[#2B7C7E]">labs</span> works
        </h2>
      </div>

      <div className="bg-gray-100 h-full flex flex-col items-center justify-center font-sans p-2">
        <div className="w-full max-w-3xl mx-auto mt-15 mb-15">
          {/* Carousel Container */}
          <div className="relative overflow-hidden bg-white rounded-2xl shadow-2xl h-72">
            {/* Sliding Wrapper */}
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {/* Individual Feature Slides */}
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`w-full flex-shrink-0 h-72 p-4 md:p-8 flex flex-col items-center justify-center text-center ${feature.bgColor}`}
                >
                  <div className="mb-2">{feature.icon}</div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                    {feature.title}
                  </h2>
                  <p className="text-gray-600 max-w-md text-sm md:text-base">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center mt-4 space-x-3">
            <button
              onClick={handlePrev}
              className="group flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg hover:bg-gray-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-label="Previous Slide"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700 cursor-pointer transition-colors" />
            </button>
            <button
              onClick={handleNext}
              className="group flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg hover:bg-gray-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-label="Next Slide"
            >
              <ArrowRight className="w-5 h-5 text-gray-700 cursor-pointer transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
