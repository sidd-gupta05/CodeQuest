'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  UserPlus,
  Calendar,
  FileText,
  Tag,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function HowItWorks() {
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

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % features.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + features.length) % features.length
    );
  };

  return (
    <>
      <div className="flex flex-col items-center py-8 bg-[#E9EBF1] px-2 select-none pointer-events-none">
        <h2 className="text-4xl sm:text-5xl font-bold text-center text-[#0F2E2E] mb-2 sm:mb-6">
          How <span className="text-[#2B7C7E]">labs</span> works
        </h2>
      </div>

      <div className="bg-gray-100 h-full flex flex-col items-center justify-center font-sans p-2 select-none">
        <div className="w-full max-w-3xl mx-auto mt-12 mb-12">
          <div className="relative overflow-hidden bg-white rounded-2xl shadow-2xl h-72">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
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

          <div className="flex items-center justify-center mt-4 space-x-3 select-none">
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
