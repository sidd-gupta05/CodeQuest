// 'use client';

// import Image from 'next/image';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import CountUp from 'react-countup';
// import { useInView } from 'react-intersection-observer';
// import { useState, useEffect } from 'react';
// import Footer from '@/components/footer';
// import { urbanistFontBold, urbanistFontRegular } from './fonts';
// import '@/public/css/lufga.css';
// import '@/public/css/clash-display.css';
// import { AnimatePresence, motion } from 'framer-motion';
// import {
//   ArrowLeft,
//   ArrowRight,
//   UserPlus,
//   Calendar,
//   FileText,
//   Tag,
// } from 'lucide-react';
// import { Inter } from 'next/font/google';
// import Navbar from '@/components/navbar';
// import { labsData } from '@/data/labsData';

// interface Lab {
//   name: string;
//   location: string;
//   image: string;
// }

// interface Testimonial {
//   id: number;
//   name: string;
//   username: string;
//   content: string;
//   avatar: string;
//   socialIcon: string;
// }

// interface Feature {
//   icon: JSX.Element;
//   title: string;
//   description: string;
//   bgColor: string;
// }

// const localImages = [
//   '/drlab.png',
//   '/drlab1.png',
//   '/drlab2.png',
//   '/drlab3.png',
//   '/drlab4.png',
// ];

// const interFont = Inter({ subsets: ['latin'], weight: '400' });

// const variants = {
//   enter: (direction: number) => ({
//     x: direction > 0 ? '100%' : '-100%',
//     opacity: 0,
//   }),
//   center: {
//     x: 0,
//     opacity: 1,
//   },
//   exit: (direction: number) => ({
//     x: direction > 0 ? '-100%' : '100%',
//     opacity: 0,
//   }),
// };

// const testimonials: Testimonial[] = [
//   {
//     id: 1,
//     name: 'Rajesh Sharma',
//     username: '@rajesh_sharma',
//     content:
//       'The lab booking process was incredibly smooth and saved me hours of waiting time. Got my reports within 24 hours!',
//     avatar: '/avtar1.svg',
//     socialIcon: '/twitter.svg',
//   },
//   {
//     id: 2,
//     name: 'Priya Patel',
//     username: '@priyapatel_',
//     content:
//       'As a working professional, the home collection service has been a lifesaver. Professional staff and accurate reports every time.',
//     avatar: '/avtar2.svg',
//     socialIcon: '/instagram.svg',
//   },
//   {
//     id: 3,
//     name: 'Amit Singh',
//     username: '@amitsingh',
//     content:
//       'The app made it so easy to compare labs and book tests. Saved 30% on my full body checkup compared to walk-in rates.',
//     avatar: '/avtar3.svg',
//     socialIcon: '/facebook.svg',
//   },
//   {
//     id: 4,
//     name: 'Neha Gupta',
//     username: '@nehagupta88',
//     content:
//       'Impressed with the transparency in pricing and the quality of service. Will definitely recommend to my family and friends.',
//     avatar: '/avtar2.svg',
//     socialIcon: '/instagram.svg',
//   },
//   {
//     id: 5,
//     name: 'Vikram Joshi',
//     username: '@vikramjoshi',
//     content:
//       'The doctor consultation after my test results was very helpful. Complete healthcare solution in one platform.',
//     avatar: '/avtar1.svg',
//     socialIcon: '/twitter.svg',
//   },
//   {
//     id: 6,
//     name: 'Ananya Reddy',
//     username: '@ananya_reddy',
//     content:
//       'Used the emergency services when my father needed urgent tests. The support team was very responsive and helpful.',
//     avatar: '/avtar2.svg',
//     socialIcon: '/instagram.svg',
//   },
// ];

// const staggerContainer = {
//   hidden: {},
//   visible: {
//     transition: {
//       staggerChildren: 0.1,
//     },
//   },
// };

// const fadeInUp = {
//   hidden: {
//     opacity: 0,
//     y: 30,
//   },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: {
//       duration: 0.7,
//       ease: 'easeOut',
//     },
//   },
// } as const;

// const cardVariants = {
//   offscreen: {
//     x: -100,
//     opacity: 0,
//   },
//   onscreen: {
//     x: 0,
//     opacity: 1,
//     transition: {
//       type: 'spring',
//       bounce: 0.4,
//       duration: 0.8,
//     },
//   },
//   exit: {
//     x: 100,
//     opacity: 0,
//     transition: {
//       duration: 0.5,
//     },
//   },
// } as const;

// const animationVariants = {
//   fromTopLeft: {
//     visible: { opacity: 1, x: 0, y: 0 },
//     hidden: { opacity: 0, x: -50, y: -50 },
//   },
//   fromLeftMid: {
//     visible: { opacity: 1, x: 0 },
//     hidden: { opacity: 0, x: -50 },
//   },
//   fromBottomLeft: {
//     visible: { opacity: 1, x: 0, y: 0 },
//     hidden: { opacity: 0, x: -50, y: 50 },
//   },
//   fromTop: { visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: -50 } },
//   fromCenter: {
//     visible: { opacity: 1, scale: 1 },
//     hidden: { opacity: 0, scale: 0.8 },
//   },
//   fromBottom: {
//     visible: { opacity: 1, y: 0 },
//     hidden: { opacity: 0, y: 50 },
//   },
//   fromTopRight: {
//     visible: { opacity: 1, x: 0, y: 0 },
//     hidden: { opacity: 0, x: 50, y: -50 },
//   },
//   fromMidRight: {
//     visible: { opacity: 1, x: 0 },
//     hidden: { opacity: 0, x: 50 },
//   },
//   fromBottomRight: {
//     visible: { opacity: 1, x: 0, y: 0 },
//     hidden: { opacity: 0, x: 50, y: 50 },
//   },
// };

// export default function LandingPage() {
//   const router = useRouter();
//   const { ref, inView } = useInView({
//     triggerOnce: true,
//     threshold: 0.5,
//   });

//   const [startCount, setStartCount] = useState(false);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const features: Feature[] = [
//     {
//       icon: <UserPlus className="w-16 h-16 text-blue-500" />,
//       title: 'Register & Login',
//       description:
//         'Patients can easily sign up and log in to LabSphere to manage their health profile and appointments seamlessly.',
//       bgColor: 'bg-blue-50',
//     },
//     {
//       icon: <Calendar className="w-16 h-16 text-green-500" />,
//       title: 'Book Lab Tests',
//       description:
//         'Book appointments at nearby path labs at your convenience. Our easy-to-use system helps you find a time that works for you.',
//       bgColor: 'bg-green-50',
//     },
//     {
//       icon: <FileText className="w-16 h-16 text-purple-500" />,
//       title: 'Track Your Reports',
//       description:
//         'Keep track of your lab reports in real-time. Get urgent reports delivered directly to your phone through the LabSphere platform.',
//       bgColor: 'bg-purple-50',
//     },
//     {
//       icon: <Tag className="w-16 h-16 text-red-500" />,
//       title: 'Discounts & Best Prices',
//       description:
//         'Take advantage of exclusive discounts and competitive pricing on a wide range of lab tests, making healthcare more affordable.',
//       bgColor: 'bg-red-50',
//     },
//   ];

//   useEffect(() => {
//     if (inView) setStartCount(true);
//   }, [inView]);

//   const handleNext = () => {
//     setCurrentIndex((prevIndex) => (prevIndex + 1) % features.length);
//   };

//   const handlePrev = () => {
//     setCurrentIndex(
//       (prevIndex) => (prevIndex - 1 + features.length) % features.length
//     );
//   };

//   const MotionLink = motion(Link);

//   const animationProps = {
//     initial: 'hidden',
//     whileInView: 'visible',
//     viewport: { once: false },
//     transition: { duration: 0.6 },
//   };

//   const displayedLabs = labsData.slice(0, 5).map((lab, index) => ({
//     ...lab,
//     image: localImages[index % localImages.length], // Cycle through your local images
//   }));

//   return (
//     <>
//       <main
//         className={`min-h-screen flex flex-col text-white`}
//         style={{
//           background:
//             'linear-gradient(180deg, #05303B -14.4%, #2B7C7E 11.34%, #91D8C1 55.01%, #FFF 100%)',
//         }}
//       >
//         <Navbar />

//         {/* Hero Section */}
//         <section
//           className={`flex flex-col items-center justify-center px-6 lg:px-24 py-12 gap-12`}
//         >
//           <div className="flex flex-col items-center select-none pointer-events-none">
//             <h1 className="text-4xl md:text-5xl font-bold leading-tight text-center flex flex-wrap justify-center gap-2">
//               <span className="text-white">Your</span>
//               <span className="bg-white/20 text-white px-4 py-1 rounded-full backdrop-blur-md font-semibold">
//                 Health
//               </span>
//               <span className="text-white">Deserves Speed</span>
//             </h1>
//             <p className="text-white text-4xl md:text-5xl font-bold text-center mt-4">
//               Precision & Simplicity
//             </p>

//             <p
//               className="mt-6 text-black text-md md:text-lg text-center"
//               style={{ fontFamily: 'Lufga SemiBold, Urbanist, sans-serif' }}
//             >
//               Book lab tests online, get accurate reports fast, and track
//               everything in one secure platform
//               <br />
//               <strong>NO queues, no confusion</strong>
//             </p>
//           </div>
//         </section>

//         <Link
//           href={'/optionss'}
//           className="inline-block bg-[#2B7C7E] hover:bg-[#1f5d5f] text-white py-3 px-8 rounded-full text-xl font-semibold shadow-lg transition-all duration-300 hover:shadow-2xl mx-auto mb-10 transform hover:scale-110 select-none"
//         >
//           Get Started
//         </Link>

//         <div
//           className="absolute bottom-[-385px] left-1/2 z-10 w-full h-[200px] bg-gray-200 border border-gray-300 hidden md:block select-none pointer-events-none"
//           style={{
//             transform: 'translateX(-50%) perspective(800px) rotateX(50deg)',
//             transformOrigin: 'bottom',
//           }}
//         />
//         <div className="relative w-full max-w-lg mx-auto select-none pointer-events-none">
//           <Image
//             src="/iphone.svg"
//             alt="Labsphere App"
//             width={500}
//             height={500}
//             className="w-full relative z-20"
//           />

//           {/* Stats Box */}
//           <div className="absolute top-1/100 right-2 sm:right-4 md:right-[-250px] bg-white/10 backdrop-blur-3xl text-white text-2xl sm:text-3xl md:text-6xl lg:text-7xl font-extrabold px-3 sm:px-4 md:px-8 lg:px-10 py-3 sm:py-4 md:py-6 rounded-2xl border-2 border-white shadow-lg w-60 sm:w-72 md:w-96 h-[130px] sm:h-[160px] md:h-[200px] flex flex-col items-center justify-center text-center leading-none z-30 animate-[bounce_2.5s_infinite]">
//             <span className="text-white drop-shadow-3xl font-clash-semibold">
//               1000+
//             </span>
//             <span className="text-white text-base sm:text-xl md:text-3xl lg:text-5xl font-semibold drop-shadow-3xl">
//               labs enlisted
//             </span>
//           </div>

//           {/* Calendar */}
//           <div className="absolute left-[-20px] sm:left-[400px] md:left-[-340px] bottom-[10px] z-20">
//             <Image
//               src="/calendar.png"
//               alt="Calendar"
//               width={470}
//               height={200}
//               className="w-40 sm:w-60 md:w-[470px]"
//             />
//           </div>

//           {/* Floating Info Card */}
//           <div className="absolute top-[25%] sm:top-[10%] left-2 sm:left-[-100px] md:left-[-350px] bg-white text-black px-4 py-2 rounded-lg shadow-md w-[280px] sm:w-[320px] text-sm flex flex-col gap-1 z-30">
//             <div className="flex justify-between items-start">
//               <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm">
//                 <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                 10:00–13:00
//               </div>
//               <button className="text-gray-400 hover:text-gray-600 text-xl leading-none cursor-pointer">
//                 ⋯
//               </button>
//             </div>

//             <div
//               className="text-sm sm:text-base text-black"
//               style={{ fontFamily: 'Lufga, Urbanist, sans-serif' }}
//             >
//               Design new UX flow for Michael
//             </div>

//             <div
//               className="text-gray-500 text-xs sm:text-sm"
//               style={{ fontFamily: 'Lufga, Urbanist, sans-serif' }}
//             >
//               Start from screen 16
//             </div>
//           </div>
//         </div>
//       </main>

//       <div
//         ref={ref}
//         className="flex justify-center items-center bg-white w-full py-10 select-none pointer-events-none"
//       >
//         <div
//           className="flex flex-col sm:flex-row justify-between w-full max-w-5xl px-6 text-center"
//           style={{ fontFamily: 'ClashDisplay-Medium, Urbanist, sans-serif' }}
//         >
//           <div>
//             <h2
//               className="text-5xl font-extrabold text-black"
//               style={{ fontFamily: 'Lufga SemiBold, Urbanist, sans-serif' }}
//             >
//               {startCount && <CountUp end={10000} duration={2} separator="," />}
//               +
//             </h2>
//             <p className={`text-[#363D4F] text-3xl mt-2`}>Tests Processed</p>
//           </div>
//           <div>
//             <h2
//               className="text-5xl font-extrabold text-black"
//               style={{ fontFamily: 'Lufga SemiBold, Urbanist, sans-serif' }}
//             >
//               {startCount && <CountUp end={300} duration={2} />}+
//             </h2>
//             <p className={`text-[#363D4F] mt-2 text-3xl`}>Verified Labs</p>
//           </div>
//           <div>
//             <h2
//               className="text-5xl font-extrabold text-black"
//               style={{ fontFamily: 'Lufga SemiBold, Urbanist, sans-serif' }}
//             >
//               {startCount && <CountUp end={50} duration={2} />}+
//             </h2>
//             <p className={`text-[#363D4F] text-3xl mt-2`}>Cities Covered</p>
//           </div>
//         </div>
//       </div>

//       <div
//         className="bg-[#E9EBF1]"
//         style={{ fontFamily: 'Urbanist, sans-serif' }}
//       >
//         <div className="flex items-center justify-center p-4 sm:p-6 md:p-10 select-none pointer-events-none">
//           <div className="w-full sm:w-5/6 p-4 sm:p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
//             {/* Column 1 */}
//             <div>
//               {/* Row 1 - Discount Card: Animate from TOP-LEFT */}
//               <motion.div
//                 {...animationProps}
//                 variants={animationVariants.fromTopLeft}
//                 className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md mx-auto"
//               >
//                 <div>
//                   <p
//                     className={`text-sm text-[#2B7C7E] uppercase ${urbanistFontBold.className}`}
//                   >
//                     Upgrade Discount
//                   </p>
//                   <h1 className="text-2xl font-semibold text-gray-900 mt-2">
//                     Simplify Lab Management
//                   </h1>
//                   <p
//                     className={`text-gray-600 mt-1 text-md ${urbanistFontRegular.className}`}
//                   >
//                     Manage bookings, reports & users in one place.
//                   </p>
//                   <h2
//                     className={`text-4xl font-bold text-[#2B7C7E] mt-3 ${urbanistFontBold.className}`}
//                   >
//                     ₹499/-
//                   </h2>
//                 </div>
//               </motion.div>

//               <div className="justify-center flex">
//                 <div className="border-t-2 w-11/12 border-dashed text-white"></div>
//               </div>

//               {/* Row 2 - Discount Code: Animate from LEFT-MID */}
//               <motion.div
//                 {...animationProps}
//                 variants={animationVariants.fromLeftMid}
//                 className={`bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md mx-auto ${urbanistFontBold.className}`}
//               >
//                 <div>
//                   <p className="flex justify-between items-center text-xs text-gray-600 font-medium">
//                     DISCOUNT CODE <strong>LABSPHERE20</strong>
//                   </p>
//                 </div>
//                 <Image
//                   src="/barcode.svg"
//                   alt="barcode"
//                   width={500}
//                   height={40}
//                 />
//               </motion.div>
//             </div>

//             {/* Column 2 - Gradient CTA: Animate from TOP */}
//             <motion.div
//               {...animationProps}
//               variants={animationVariants.fromTop}
//               className="bg-gradient-to-br from-[#2B7C7E] to-[#91D8C1] rounded-4xl shadow-2xl p-4 flex flex-col justify-center"
//             >
//               <h2 className="text-white font-bold text-5xl leading-tight">
//                 Clean,
//                 <br />
//                 Accessible
//                 <br />
//                 UI
//               </h2>
//               <p className="text-white text-2xl mt-2">
//                 Designed for doctors,
//                 <br />
//                 labs & patients.
//               </p>
//             </motion.div>

//             {/* Column 3 - Top Labs: Animate from TOP-RIGHT */}
//             <motion.div
//               {...animationProps}
//               variants={animationVariants.fromTopRight}
//               className="bg-white rounded-4xl p-4 shadow-2xl flex flex-col items-center justify-center"
//             >
//               <p className="text-[#2B7C7E] text-xl font-semibold mb-2 text-center">
//                 Top Labs
//                 <br />
//                 at your doorstep
//               </p>
//               <Image
//                 src="/drlab.png"
//                 alt="Dr Lal"
//                 width={100}
//                 height={100}
//                 className="rounded-md"
//               />
//               <p className="text-xl mt-2 text-center">
//                 Dr Lal Path Lab
//                 <br />
//                 <span className="text-gray-500 text-xl">Wadala, Mumbai</span>
//               </p>
//               <button className="mt-2 text-xl px-3 py-1 bg-[#2B7C7E] text-white rounded-full">
//                 Book Appointment
//               </button>
//             </motion.div>

//             {/* Row 2 - Secure/Scalable: Animate from BOTTOM-LEFT */}
//             <motion.div
//               {...animationProps}
//               variants={animationVariants.fromBottomLeft}
//               className="bg-gradient-to-br from-[#2B7C7E] to-[#91D8C1] rounded-4xl shadow-2xl p-4 text-white text-5xl font-bold text-left relative overflow-hidden"
//             >
//               <Image
//                 src="/OutGuard.svg"
//                 alt="OutGuard"
//                 width={44}
//                 height={44}
//                 className="absolute bottom-0 right-0 w-44 h-44 opacity-70 [transform:rotate(360deg)]"
//               />
//               <Image
//                 src="/InGuard.svg"
//                 alt="InGuard"
//                 width={40}
//                 height={40}
//                 className="absolute bottom-0 right-0 w-40 h-40 opacity-100 [transform:rotate(360deg)] z-10"
//               />
//               <div className="relative z-20 py-4">
//                 <div className="mb-4">Secure.</div>
//                 <div className="mb-4">Scalable.</div>
//                 <div>Seamless.</div>
//               </div>
//             </motion.div>

//             {/* Logo Block: Animate from CENTER */}
//             <motion.div
//               {...animationProps}
//               variants={animationVariants.fromCenter}
//               className="hidden sm:flex bg-white rounded-4xl shadow-xl flex flex-col items-center justify-center p-6 w-full"
//             >
//               <Image src="/logo.svg" alt="logo" width={120} height={120} />
//               <div className="text-[#2B7C7E] text-5xl font-bold mt-4">
//                 Labsphere
//               </div>
//             </motion.div>

//             {/* Mobile Compatible: Animate from MID-RIGHT */}
//             <motion.div
//               {...animationProps}
//               variants={animationVariants.fromMidRight}
//               className="bg-gradient-to-br from-[#2B7C7E] to-[#91D8C1] rounded-4xl p-4 shadow-2xl flex flex-col justify-center items-center text-white text-center"
//             >
//               <h2 className="font-bold text-3xl">Mobile Compatible</h2>
//               <Image src="/iphone.svg" alt="iphone" width={200} height={250} />
//             </motion.div>

//             {/* Dashboard & Appointment Row */}
//             <div className="col-span-1 sm:col-span-2 md:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full">
//               {/* Dashboard: Animate from BOTTOM */}
//               <motion.div
//                 {...animationProps}
//                 variants={animationVariants.fromBottom}
//                 className="col-span-1 sm:col-span-2 bg-gradient-to-br from-[#2B7C7E] to-[#91D8C1] rounded-4xl p-4 shadow-2xl text-white"
//               >
//                 <h3 className="font-bold text-4xl mt-4">Simple Dashboard</h3>
//                 <div className="bg-white rounded-lg mt-4 p-4 text-left w-3/4 mx-auto">
//                   <p className="text-5xl font-bold text-[#2B7C7E]">1000</p>
//                   <p className="text-xl text-gray-600">
//                     New customers this month
//                   </p>
//                   <div className="flex items-center gap-2 my-8">
//                     <div className="w-32 h-2 bg-gray-200 rounded">
//                       <div
//                         className="h-full bg-[#2B7C7E] rounded"
//                         style={{ width: '40%' }}
//                       ></div>
//                     </div>
//                     <span className="text-sm font-semibold text-[#2B7C7E]">
//                       40%
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2 mb-5">
//                     <div className="w-48 h-2 bg-gray-200 rounded">
//                       <div
//                         className="h-full bg-[#2B7C7E] rounded"
//                         style={{ width: '80%' }}
//                       ></div>
//                     </div>
//                     <span className="text-sm font-semibold text-[#2B7C7E]">
//                       80%
//                     </span>
//                   </div>
//                 </div>
//               </motion.div>

//               {/* "Your Health" card: Animate from CENTER */}
//               <motion.div
//                 {...animationProps}
//                 variants={animationVariants.fromCenter}
//                 className="hidden sm:flex col-span-1 bg-gradient-to-br from-[#2B7C7E] to-[#91D8C1] rounded-4xl p-4 shadow-2xl text-white text-center flex items-center justify-center"
//               >
//                 <p className="text-4xl font-bold">
//                   Your health
//                   <br />
//                   deserves speed
//                   <br />
//                   precision &<br />
//                   simplicity
//                 </p>
//               </motion.div>

//               {/* Appointment card: Animate from BOTTOM-RIGHT */}
//               <motion.div
//                 {...animationProps}
//                 variants={animationVariants.fromBottomRight}
//                 className="col-span-1 bg-white rounded-4xl p-4 shadow-2xl flex flex-col justify-between"
//               >
//                 <div>
//                   <div className="text-xs text-gray-500">🟢 10:00 - 11:00</div>
//                   <p className="text-md font-semibold mt-1">
//                     Appointment for CBC at Siddharth&apos;s Place
//                   </p>
//                   <p className="text-md text-gray-500">
//                     Antop Hill, Wadala, Mumbai
//                   </p>
//                 </div>
//                 <Image
//                   src="/calendar.png"
//                   alt="calendar"
//                   width={400}
//                   height={600}
//                   className="mt-4 rounded-lg w-full h-full"
//                 />
//               </motion.div>
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-col items-center py-16 bg-[#E9EBF1] px-4">
//           <h2 className="text-4xl sm:text-5xl font-bold text-center text-[#0F2E2E] mb-8 sm:mb-12 select-none pointer-events-none">
//             Your nearby <span className="text-[#2B7C7E]">labs</span>
//           </h2>

//           <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
//             {displayedLabs.map((lab, index) => (
//               <motion.div
//                 key={lab.id}
//                 className="w-11/12 sm:w-[250px] rounded-3xl overflow-hidden shadow-md bg-[#91D8C1] p-[4px] hover:scale-102 hover:shadow-5xl"
//                 initial="offscreen"
//                 whileInView="onscreen"
//                 exit="exit"
//                 viewport={{ once: false, amount: 0.2 }}
//                 variants={cardVariants}
//               >
//                 <div className="rounded-[22px] flex flex-col items-center bg-gradient-to-br from-[#2B7C7E] to-[#91D8C1] h-full">
//                   {/* Image placed on top without border box */}
//                   <div className="relative w-full flex justify-center mt-6">
//                     <div className="w-[120px] h-[150px] relative select-none pointer-events-none">
//                       <Image
//                         src={lab.image}
//                         alt={lab.name}
//                         fill
//                         className="object-cover rounded-xl"
//                         priority={index < 3}
//                       />
//                     </div>
//                   </div>

//                   {/* White card part */}
//                   <div className="bg-white rounded-2xl px-4 pt-6 pb-4 mx-4 mb-4 w-[calc(100%-32px)] text-center shadow-lg flex flex-col h-full">
//                     <div className="flex-grow">
//                       <div className="text-lg font-semibold text-[#0F2E2E] text-center select-none pointer-events-none">
//                         {lab.name}
//                       </div>
//                       <div className="text-sm text-gray-500 text-center select-none pointer-events-none mt-2">
//                         {lab.location}
//                       </div>
//                     </div>

//                     <div className="mt-auto pt-4">
//                       {lab.nextAvailable === 'Not Available' ? (
//                         <button
//                           className="w-full bg-gray-300 text-gray-500 py-2 rounded-xl font-medium cursor-not-allowed select-none"
//                           disabled
//                         >
//                           Unavailable
//                         </button>
//                       ) : (
//                         <Link
//                           href={{
//                             pathname: '/Booking',
//                             query: { labId: lab.id },
//                           }}
//                           className="block w-full"
//                         >
//                           <button className="w-full bg-[#2B7C7E] text-white py-2 rounded-xl font-medium hover:bg-[#24686A] transition cursor-pointer select-none">
//                             Book Appointment
//                           </button>
//                         </Link>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="flex flex-col items-center py-8 bg-[#E9EBF1] px-2 select-none pointer-events-none">
//         <h2 className="text-4xl sm:text-5xl font-bold text-center text-[#0F2E2E] mb-2 sm:mb-6">
//           How <span className="text-[#2B7C7E]">labs</span> works
//         </h2>
//       </div>

//       <div className="bg-gray-100 h-full flex flex-col items-center justify-center font-sans p-2 select-none ">
//         <div className="w-full max-w-3xl mx-auto mt-12 mb-12">
//           {/* Carousel Container */}
//           <div className="relative overflow-hidden bg-white rounded-2xl shadow-2xl h-72">
//             {/* Sliding Wrapper */}
//             <div
//               className="flex transition-transform duration-700 ease-in-out"
//               style={{ transform: `translateX(-${currentIndex * 100}%)` }}
//             >
//               {/* Individual Feature Slides */}
//               {features.map((feature, index) => (
//                 <div
//                   key={index}
//                   className={`w-full flex-shrink-0 h-72 p-4 md:p-8 flex flex-col items-center justify-center text-center ${feature.bgColor}`}
//                 >
//                   <div className="mb-2">{feature.icon}</div>
//                   <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
//                     {feature.title}
//                   </h2>
//                   <p className="text-gray-600 max-w-md text-sm md:text-base">
//                     {feature.description}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Navigation Controls */}
//           <div className="flex items-center justify-center mt-4 space-x-3 select-none">
//             <button
//               onClick={handlePrev}
//               className="group flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg hover:bg-gray-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
//               aria-label="Previous Slide"
//             >
//               <ArrowLeft className="w-5 h-5 text-gray-700 cursor-pointer transition-colors" />
//             </button>
//             <button
//               onClick={handleNext}
//               className="group flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg hover:bg-gray-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
//               aria-label="Next Slide"
//             >
//               <ArrowRight className="w-5 h-5 text-gray-700 cursor-pointer transition-colors" />
//             </button>
//           </div>
//         </div>
//       </div>

//       <div
//         className="min-h-screen pt-10 pb-20 px-4 md:px-12 lg:px-20"
//         style={{
//           backgroundImage: "url('/spidernet.png')",
//           backgroundSize: '250px',
//           backgroundRepeat: 'no-repeat',
//           backgroundPosition: 'top center',
//         }}
//       >
//         <motion.div
//           className="text-center max-w-4xl mx-auto mb-16"
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true, amount: 0.5 }}
//           variants={staggerContainer}
//         >
//           <motion.h1
//             className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight select-none pointer-events-none"
//             variants={fadeInUp}
//           >
//             <span>See what our</span>
//             <br />
//             <span className="text-[#2B7C7E]">customers </span>
//             <span>are saying</span>
//           </motion.h1>

//           <MotionLink
//             href={'/optionss'}
//             className="mt-8 inline-block bg-[#2B7C7E] hover:bg-[#1f5d5f] text-white py-3 px-8 rounded-full text-sm font-semibold shadow-lg transition-all duration-300 hover:shadow-2xl animate-bounce select-none "
//           >
//             Get Started
//           </MotionLink>
//         </motion.div>

//         <motion.div
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto cursor-pointer"
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true, amount: 0.2 }}
//           variants={staggerContainer}
//         >
//           {testimonials.map((item) => (
//             <motion.div
//               key={item.id}
//               className="bg-white h-[280px] md:h-[260px] p-6 rounded-xl shadow-md hover:shadow-2xl transition duration-300 flex flex-col select-none "
//               variants={fadeInUp}
//             >
//               <div className="flex-grow">
//                 <h3 className="text-md font-semibold mb-2">
//                   Incredibly useful product
//                 </h3>
//                 <p className="text-gray-600 text-sm mb-4 line-clamp-4">
//                   {item.content}
//                 </p>
//               </div>
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <Image
//                     src={item.avatar}
//                     alt={item.name}
//                     width={50}
//                     height={50}
//                     className="rounded-full"
//                   />
//                   <div className="text-sm">
//                     <p className="font-medium text-gray-800">{item.name}</p>
//                     <p className="text-[#2B7C7E] text-xs">{item.username}</p>
//                   </div>
//                 </div>
//                 <Image
//                   src={item.socialIcon}
//                   alt="social"
//                   width={25}
//                   height={25}
//                   className="rounded-full cursor-pointer hover:opacity-80 transition-opacity bg-gray-200 border border-gray-300 shadow-md"
//                 />
//               </div>
//             </motion.div>
//           ))}
//         </motion.div>
//       </div>

//       <Footer />
//     </>
//   );
// }

'use client';

import Footer from '@/components/footer';
import HeroSection from '@/components/landingPage/HeroSection';
import StatsSection from '@/components/landingPage/StatsSection';
import FeaturesGrid from '@/components/landingPage/FeaturesGrid';
import LabCards from '@/components/landingPage/LabCards';
import HowItWorks from '@/components/landingPage/HowItWorks';
import Testimonials from '@/components/landingPage/Testimonials';
import '@/public/css/lufga.css';
import '@/public/css/clash-display.css';

export default function LandingPage() {
  return (
    <>
      <main className="min-h-screen flex flex-col text-white">
        <HeroSection />
        <StatsSection />
        <FeaturesGrid />
        <LabCards />
        <HowItWorks />
        <Testimonials />
        <Footer />
      </main>
    </>
  );
}
