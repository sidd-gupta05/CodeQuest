'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeInUp = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: 'easeOut',
    },
  },
} as const;

const testimonials = [
  {
    id: 1,
    name: 'Rajesh Sharma',
    username: '@rajesh_sharma',
    content:
      'The lab booking process was incredibly smooth and saved me hours of waiting time. Got my reports within 24 hours!',
    avatar: '/avtar1.svg',
    socialIcon: '/twitter.svg',
  },
  {
    id: 2,
    name: 'Priya Patel',
    username: '@priyapatel_',
    content:
      'As a working professional, the home collection service has been a lifesaver. Professional staff and accurate reports every time.',
    avatar: '/avtar2.svg',
    socialIcon: '/instagram.svg',
  },
  {
    id: 3,
    name: 'Amit Singh',
    username: '@amitsingh',
    content:
      'The app made it so easy to compare labs and book tests. Saved 30% on my full body checkup compared to walk-in rates.',
    avatar: '/avtar3.svg',
    socialIcon: '/facebook.svg',
  },
  {
    id: 4,
    name: 'Neha Gupta',
    username: '@nehagupta88',
    content:
      'Impressed with the transparency in pricing and the quality of service. Will definitely recommend to my family and friends.',
    avatar: '/avtar2.svg',
    socialIcon: '/instagram.svg',
  },
  {
    id: 5,
    name: 'Vikram Joshi',
    username: '@vikramjoshi',
    content:
      'The doctor consultation after my test results was very helpful. Complete healthcare solution in one platform.',
    avatar: '/avtar1.svg',
    socialIcon: '/twitter.svg',
  },
  {
    id: 6,
    name: 'Ananya Reddy',
    username: '@ananya_reddy',
    content:
      'Used the emergency services when my father needed urgent tests. The support team was very responsive and helpful.',
    avatar: '/avtar2.svg',
    socialIcon: '/instagram.svg',
  },
];

export default function Testimonials() {
  return (
    <div
      className="min-h-screen pt-10 pb-20 px-4 md:px-12 lg:px-20"
      style={{
        backgroundImage: "url('/spidernet.png')",
        backgroundSize: '250px',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top center',
      }}
    >
      <motion.div
        className="text-center max-w-4xl mx-auto mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={staggerContainer}
      >
        <motion.h1
          className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight select-none pointer-events-none"
          variants={fadeInUp}
        >
          <span>See what our</span>
          <br />
          <span className="text-[#2B7C7E]">customers </span>
          <span>are saying</span>
        </motion.h1>

        <motion.div variants={fadeInUp}>
          <Link
            href={'/optionss'}
            className="mt-8 inline-block bg-[#2B7C7E] hover:bg-[#1f5d5f] text-white py-3 px-8 rounded-full text-sm font-semibold shadow-lg transition-all duration-300 hover:shadow-2xl animate-bounce select-none"
          >
            Get Started
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto cursor-pointer"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        {testimonials.map((item) => (
          <motion.div
            key={item.id}
            className="bg-white h-[280px] md:h-[260px] p-6 rounded-xl shadow-md hover:shadow-2xl transition duration-300 flex flex-col select-none"
            variants={fadeInUp}
          >
            <div className="flex-grow">
              <h3 className="text-md font-semibold mb-2">
                Incredibly useful product
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-4">
                {item.content}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image
                  src={item.avatar}
                  alt={item.name}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div className="text-sm">
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-[#2B7C7E] text-xs">{item.username}</p>
                </div>
              </div>
              <Image
                src={item.socialIcon}
                alt="social"
                width={25}
                height={25}
                className="rounded-full cursor-pointer hover:opacity-80 transition-opacity bg-gray-200 border border-gray-300 shadow-md"
              />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
