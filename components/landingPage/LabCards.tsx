'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { labsData } from '@/data/labsData';

const localImages = [
  '/drlab.png',
  '/drlab1.png',
  '/drlab2.png',
  '/drlab3.png',
  '/drlab4.png',
];

const cardVariants = {
  offscreen: {
    x: -100,
    opacity: 0,
  },
  onscreen: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
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

export default function LabCards() {
  const displayedLabs = labsData.slice(0, 5).map((lab, index) => ({
    ...lab,
    image: localImages[index % localImages.length],
  }));

  return (
    <div className="flex flex-col items-center py-16 bg-[#E9EBF1] px-4">
      <h2 className="text-4xl sm:text-5xl font-bold text-center text-[#0F2E2E] mb-8 sm:mb-12 select-none pointer-events-none">
        Your nearby <span className="text-[#2B7C7E]">labs</span>
      </h2>

      <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
        {displayedLabs.map((lab, index) => (
          <motion.div
            key={lab.id}
            className="w-11/12 sm:w-[250px] rounded-3xl overflow-hidden shadow-md bg-[#91D8C1] p-[4px] hover:scale-102 hover:shadow-5xl"
            initial="offscreen"
            whileInView="onscreen"
            exit="exit"
            viewport={{ once: false, amount: 0.2 }}
            variants={cardVariants}
          >
            <div className="rounded-[22px] flex flex-col items-center bg-gradient-to-br from-[#2B7C7E] to-[#91D8C1] h-full">
              <div className="relative w-full flex justify-center mt-6">
                <div className="w-[120px] h-[150px] relative select-none pointer-events-none">
                  <Image
                    src={lab.image}
                    alt={lab.name}
                    fill
                    className="object-cover rounded-xl"
                    priority={index < 3}
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl px-4 pt-6 pb-4 mx-4 mb-4 w-[calc(100%-32px)] text-center shadow-lg flex flex-col h-full">
                <div className="flex-grow">
                  <div className="text-lg font-semibold text-[#0F2E2E] text-center select-none pointer-events-none">
                    {lab.name}
                  </div>
                  <div className="text-sm text-gray-500 text-center select-none pointer-events-none mt-2">
                    {lab.location}
                  </div>
                </div>

                <div className="mt-auto pt-4">
                  {lab.nextAvailable === 'Not Available' ? (
                    <button
                      className="w-full bg-gray-300 text-gray-500 py-2 rounded-xl font-medium cursor-not-allowed select-none"
                      disabled
                    >
                      Unavailable
                    </button>
                  ) : (
                    <Link
                      href={{
                        pathname: '/Booking',
                        query: { labId: lab.id },
                      }}
                      className="block w-full"
                    >
                      <button className="w-full bg-[#2B7C7E] text-white py-2 rounded-xl font-medium hover:bg-[#24686A] transition cursor-pointer select-none">
                        Book Appointment
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
