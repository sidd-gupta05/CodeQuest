'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { UserPlus, Calendar, FileText, Tag } from 'lucide-react';
import Image from 'next/image';

const animationVariants = {
  fromTopLeft: {
    visible: { opacity: 1, x: 0, y: 0 },
    hidden: { opacity: 0, x: -50, y: -50 },
  },
  fromLeftMid: {
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0, x: -50 },
  },
  fromBottomLeft: {
    visible: { opacity: 1, x: 0, y: 0 },
    hidden: { opacity: 0, x: -50, y: 50 },
  },
  fromTop: { visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: -50 } },
  fromCenter: {
    visible: { opacity: 1, scale: 1 },
    hidden: { opacity: 0, scale: 0.8 },
  },
  fromBottom: {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 50 },
  },
  fromTopRight: {
    visible: { opacity: 1, x: 0, y: 0 },
    hidden: { opacity: 0, x: 50, y: -50 },
  },
  fromMidRight: {
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0, x: 50 },
  },
  fromBottomRight: {
    visible: { opacity: 1, x: 0, y: 0 },
    hidden: { opacity: 0, x: 50, y: 50 },
  },
};

export default function FeaturesGrid() {
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

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % features.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + features.length) % features.length
    );
  };

  const animationProps = {
    initial: 'hidden',
    whileInView: 'visible',
    viewport: { once: false },
    transition: { duration: 0.6 },
  };

  return (
    <div className="flex items-center justify-center p-4 sm:p-6 md:p-10 select-none pointer-events-none">
      <div className="w-full sm:w-5/6 p-4 sm:p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {/* Column 1 */}
        <div>
          {/* Row 1 - Discount Card */}
          <motion.div
            {...animationProps}
            variants={animationVariants.fromTopLeft}
            className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md mx-auto"
          >
            <div>
              <p className="text-sm text-[#2B7C7E] uppercase font-bold">
                Upgrade Discount
              </p>
              <h1 className="text-2xl font-semibold text-gray-900 mt-2">
                Simplify Lab Management
              </h1>
              <p className="text-gray-600 mt-1 text-md">
                Manage bookings, reports & users in one place.
              </p>
              <h2 className="text-4xl font-bold text-[#2B7C7E] mt-3">₹499/-</h2>
            </div>
          </motion.div>

          <div className="justify-center flex">
            <div className="border-t-2 w-11/12 border-dashed text-white"></div>
          </div>

          {/* Row 2 - Discount Code */}
          <motion.div
            {...animationProps}
            variants={animationVariants.fromLeftMid}
            className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md mx-auto font-bold"
          >
            <div>
              <p className="flex justify-between items-center text-xs text-gray-600 font-medium">
                DISCOUNT CODE <strong>LABSPHERE20</strong>
              </p>
            </div>
            <Image src="/barcode.svg" alt="barcode" width={500} height={40} />
          </motion.div>
        </div>

        {/* Column 2 - Gradient CTA */}
        <motion.div
          {...animationProps}
          variants={animationVariants.fromTop}
          className="bg-gradient-to-br from-[#2B7C7E] to-[#91D8C1] rounded-4xl shadow-2xl p-4 flex flex-col justify-center"
        >
          <h2 className="text-white font-bold text-5xl leading-tight">
            Clean,
            <br />
            Accessible
            <br />
            UI
          </h2>
          <p className="text-white text-2xl mt-2">
            Designed for doctors,
            <br />
            labs & patients.
          </p>
        </motion.div>

        {/* Column 3 - Top Labs */}
        <motion.div
          {...animationProps}
          variants={animationVariants.fromTopRight}
          className="bg-white rounded-4xl p-4 shadow-2xl flex flex-col items-center justify-center"
        >
          <p className="text-[#2B7C7E] text-xl font-semibold mb-2 text-center">
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
          <p className="text-xl mt-2 text-center">
            Dr Lal Path Lab
            <br />
            <span className="text-gray-500 text-xl">Wadala, Mumbai</span>
          </p>
          <button className="mt-2 text-xl px-3 py-1 bg-[#2B7C7E] text-white rounded-full">
            Book Appointment
          </button>
        </motion.div>

        {/* Row 2 - Secure/Scalable */}
        <motion.div
          {...animationProps}
          variants={animationVariants.fromBottomLeft}
          className="bg-gradient-to-br from-[#2B7C7E] to-[#91D8C1] rounded-4xl shadow-2xl p-4 text-white text-5xl font-bold text-left relative overflow-hidden"
        >
          <Image
            src="/OutGuard.svg"
            alt="OutGuard"
            width={176}
            height={176}
            className="absolute bottom-0 right-0 opacity-70 [transform:rotate(360deg)]"
          />
          <Image
            src="/InGuard.svg"
            alt="InGuard"
            width={160}
            height={160}
            className="absolute bottom-0 right-0 opacity-100 [transform:rotate(360deg)] z-10"
          />
          <div className="relative z-20 py-4">
            <div className="mb-4">Secure.</div>
            <div className="mb-4">Scalable.</div>
            <div>Seamless.</div>
          </div>
        </motion.div>

        {/* Logo Block */}
        <motion.div
          {...animationProps}
          variants={animationVariants.fromCenter}
          className="hidden sm:flex bg-white rounded-4xl shadow-xl flex-col items-center justify-center p-6 w-full"
        >
          <Image src="/logo.svg" alt="logo" width={120} height={120} />
          <div className="text-[#2B7C7E] text-5xl font-bold mt-4">
            Labsphere
          </div>
        </motion.div>

        {/* Mobile Compatible */}
        <motion.div
          {...animationProps}
          variants={animationVariants.fromMidRight}
          className="bg-gradient-to-br from-[#2B7C7E] to-[#91D8C1] rounded-4xl p-4 shadow-2xl flex flex-col justify-center items-center text-white text-center"
        >
          <h2 className="font-bold text-3xl">Mobile Compatible</h2>
          <Image src="/iphone.svg" alt="iphone" width={200} height={250} />
        </motion.div>

        {/* Dashboard & Appointment Row */}
        <div className="col-span-1 sm:col-span-2 md:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full">
          {/* Dashboard */}
          <motion.div
            {...animationProps}
            variants={animationVariants.fromBottom}
            className="col-span-1 sm:col-span-2 bg-gradient-to-br from-[#2B7C7E] to-[#91D8C1] rounded-4xl p-4 shadow-2xl text-white"
          >
            <h3 className="font-bold text-4xl mt-4">Simple Dashboard</h3>
            <div className="bg-white rounded-lg mt-4 p-4 text-left w-3/4 mx-auto">
              <p className="text-5xl font-bold text-[#2B7C7E]">1000</p>
              <p className="text-xl text-gray-600">New customers this month</p>
              <div className="flex items-center gap-2 my-8">
                <div className="w-32 h-2 bg-gray-200 rounded">
                  <div
                    className="h-full bg-[#2B7C7E] rounded"
                    style={{ width: '40%' }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-[#2B7C7E]">
                  40%
                </span>
              </div>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-48 h-2 bg-gray-200 rounded">
                  <div
                    className="h-full bg-[#2B7C7E] rounded"
                    style={{ width: '80%' }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-[#2B7C7E]">
                  80%
                </span>
              </div>
            </div>
          </motion.div>

          {/* "Your Health" card */}
          <motion.div
            {...animationProps}
            variants={animationVariants.fromCenter}
            className="hidden sm:flex col-span-1 bg-gradient-to-br from-[#2B7C7E] to-[#91D8C1] rounded-4xl p-4 shadow-2xl text-white text-center items-center justify-center"
          >
            <p className="text-4xl font-bold">
              Your health
              <br />
              deserves speed
              <br />
              precision &<br />
              simplicity
            </p>
          </motion.div>

          {/* Appointment card */}
          <motion.div
            {...animationProps}
            variants={animationVariants.fromBottomRight}
            className="col-span-1 bg-white rounded-4xl p-4 shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="text-xs text-gray-500">🟢 10:00 - 11:00</div>
              <p className="text-md font-semibold mt-1">
                Appointment for CBC at Siddharth&apos;s Place
              </p>
              <p className="text-md text-gray-500">
                Antop Hill, Wadala, Mumbai
              </p>
            </div>
            <Image
              src="/calendar.png"
              alt="calendar"
              width={400}
              height={600}
              className="mt-4 rounded-lg w-full h-full"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
