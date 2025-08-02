// 'use client';

// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useSearchParams } from 'next/navigation';
// import Navbar from '@/components/navbar';
// import Footer from '@/components/footer';
// import {
//   ChevronLeft,
//   ChevronRight,
//   Star,
//   MapPin,
//   Heart,
//   Search,
// } from 'lucide-react';
// import { labsData, allLabTests } from '@/data/labsData';
// import { motion, AnimatePresence } from 'framer-motion';

// interface Lab {
//   id: number;
//   name: string;
//   testType: string;
//   location: string;
//   nextAvailable: string;
//   rating: number;
//   experience: number;
//   isLoved: boolean;
//   image: string;
//   timeSlots: {
//     Morning: string[];
//     Afternoon: string[];
//     Evening: string[];
//   };
// }

// interface StepperProps {
//   currentStep: number;
// }

// const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
//   const steps = [
//     { number: 1, title: 'Date & Time' },
//     { number: 2, title: 'Test Selection' },
//     { number: 3, title: 'Add ons' },
//     { number: 4, title: 'Payment' },
//     { number: 5, title: 'Confirmation' },
//   ];

//   return (
//     <div className="w-full max-w-3xl mx-auto px-4 sm:px-0">
//       <div className="flex items-center justify-center my-8 sm:hidden">
//         {steps.map(
//           (step) =>
//             step.number === currentStep && (
//               <div key={step.number} className="flex flex-col items-center">
//                 <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold bg-[#37AFA2] text-white">
//                   {step.number}
//                 </div>
//                 <p className="mt-2 text-xs text-center font-semibold text-white">
//                   {step.title}
//                 </p>
//               </div>
//             )
//         )}
//       </div>

//       <div className="hidden sm:flex items-center my-8">
//         {steps.map((step, index) => (
//           <React.Fragment key={step.number}>
//             <div className="flex flex-col items-center">
//               <div
//                 className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
//                   step.number <= currentStep
//                     ? 'bg-[#37AFA2] text-white'
//                     : 'border-2 border-gray-300 text-gray-300'
//                 }`}
//               >
//                 {step.number}
//               </div>
//               <p
//                 className={`mt-2 text-xs sm:text-sm text-center font-semibold transition-all duration-300 ${
//                   step.number <= currentStep ? 'text-white' : 'text-gray-300'
//                 }`}
//               >
//                 {step.title}
//               </p>
//             </div>
//             {index < steps.length - 1 && (
//               <div
//                 className={`flex-1 border-t-2 border-dashed mx-2 sm:mx-4 transition-colors duration-300 ${
//                   step.number < currentStep ? 'border-white' : 'border-gray-300'
//                 }`}
//               ></div>
//             )}
//           </React.Fragment>
//         ))}
//       </div>
//     </div>
//   );
// };

// interface CalendarProps {
//   selectedDate: Date;
//   onDateChange: (date: Date) => void;
// }

// const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateChange }) => {
//   const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
//   const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

//   const handlePrevMonth = () => {
//     if (currentMonth === 0) {
//       setCurrentMonth(11);
//       setCurrentYear(currentYear - 1);
//     } else {
//       setCurrentMonth(currentMonth - 1);
//     }
//   };

//   const handleNextMonth = () => {
//     if (currentMonth === 11) {
//       setCurrentMonth(0);
//       setCurrentYear(currentYear + 1);
//     } else {
//       setCurrentMonth(currentMonth + 1);
//     }
//   };

//   const getDaysInMonth = (year: number, month: number) => {
//     return new Date(year, month + 1, 0).getDate();
//   };

//   const getFirstDayOfMonth = (year: number, month: number) => {
//     return new Date(year, month, 1).getDay();
//   };

//   const isDateDisabled = (day: number) => {
//     const date = new Date(currentYear, currentMonth, day);
//     date.setHours(0, 0, 0, 0);
//     return date < today;
//   };

//   const generateCalendarDays = () => {
//     const daysInMonth = getDaysInMonth(currentYear, currentMonth);
//     const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
//     const calendarDays: Array<{ day: number | null; isCurrentMonth: boolean }> =
//       [];

//     for (let i = 0; i < firstDay; i++) {
//       calendarDays.push({ day: null, isCurrentMonth: false });
//     }

//     for (let day = 1; day <= daysInMonth; day++) {
//       calendarDays.push({ day, isCurrentMonth: true });
//     }

//     return calendarDays;
//   };

//   const calendarDays = generateCalendarDays();
//   const monthYearString = new Date(currentYear, currentMonth).toLocaleString(
//     'default',
//     {
//       month: 'long',
//       year: 'numeric',
//     }
//   );

//   return (
//     <div className="w-full text-gray-700">
//       <div className="flex justify-between items-center mb-4">
//         <button
//           onClick={handlePrevMonth}
//           className="p-1 rounded-full hover:bg-gray-100"
//         >
//           <ChevronLeft size={20} />
//         </button>
//         <h4 className="font-bold text-lg">{monthYearString}</h4>
//         <button
//           onClick={handleNextMonth}
//           className="p-1 rounded-full hover:bg-gray-100"
//         >
//           <ChevronRight size={20} />
//         </button>
//       </div>
//       <div className="grid grid-cols-7 gap-y-2 text-center text-sm">
//         {daysOfWeek.map((day) => (
//           <div key={day} className="font-medium text-gray-400">
//             {day}
//           </div>
//         ))}
//         {calendarDays.map((date, i) => {
//           if (!date.isCurrentMonth) {
//             return <div key={i}></div>;
//           }
//           const isSelected =
//             selectedDate.getDate() === date.day &&
//             selectedDate.getMonth() === currentMonth &&
//             selectedDate.getFullYear() === currentYear;
//           const isDisabled = isDateDisabled(date.day!);
//           return (
//             <div
//               key={i}
//               onClick={() =>
//                 !isDisabled &&
//                 onDateChange(new Date(currentYear, currentMonth, date.day!))
//               }
//               className={`flex items-center justify-center w-9 h-9 mx-auto rounded-full cursor-pointer ${
//                 isDisabled
//                   ? 'text-gray-300 cursor-not-allowed'
//                   : isSelected
//                     ? 'bg-[#37AFA2] text-white'
//                     : 'hover:bg-gray-100'
//               }`}
//             >
//               {date.day}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// interface TimeSlotsProps {
//   selectedTime: string;
//   onTimeChange: (time: string) => void;
//   timeSlots: {
//     Morning: string[];
//     Afternoon: string[];
//     Evening: string[];
//   };
// }

// const TimeSlots: React.FC<TimeSlotsProps> = ({
//   selectedTime,
//   onTimeChange,
//   timeSlots,
// }) => {
//   return (
//     <div className="space-y-5">
//       {Object.entries(timeSlots).map(([period, slots]) => (
//         <div key={period}>
//           <p className="text-sm font-medium text-gray-500 mb-2">{period}</p>
//           <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-sm">
//             {slots.map((time, i) => {
//               const isDisabled = time === '-';
//               const isSelected = selectedTime === time;
//               return (
//                 <button
//                   key={i}
//                   disabled={isDisabled}
//                   onClick={() => onTimeChange(time)}
//                   className={`p-2 border rounded-md transition-colors ${
//                     isDisabled
//                       ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
//                       : isSelected
//                         ? 'border-transparent bg-[#37AFA2] text-white font-semibold'
//                         : 'border-gray-200 hover:border-teal-400'
//                   }`}
//                 >
//                   {time}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// interface TestSelectionProps {
//   onBack: () => void;
//   onNext: () => void;
//   selectedLab: Lab;
//   appointmentDate: string;
//   appointmentTime: string;
// }

// const TestSelection: React.FC<TestSelectionProps> = ({
//   onBack,
//   onNext,
//   selectedLab,
//   appointmentDate,
//   appointmentTime,
// }) => {
//   const [selectedTests, setSelectedTests] = useState<string[]>([]);
//   const popularTests = Object.values(allLabTests).flat().slice(0, 10);

//   const handleTestToggle = (testName: string) => {
//     setSelectedTests((prev) =>
//       prev.includes(testName)
//         ? prev.filter((test) => test !== testName)
//         : [...prev, testName]
//     );
//   };

//   const handleSelectAddons = () => {
//     onNext();
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-black w-full max-w-4xl my-8">
//       <div className="flex items-start justify-between">
//         <div className="flex items-start sm:items-center">
//           <img
//             src={selectedLab.image}
//             alt={selectedLab.name}
//             className="w-16 h-16 rounded-full mr-4 border-2 border-gray-100"
//           />
//           <div>
//             <div className="flex flex-col sm:flex-row sm:items-center">
//               <h2 className="text-xl font-bold text-gray-800">
//                 {selectedLab.name}
//               </h2>
//               <span className="mt-1 sm:mt-0 sm:ml-3 bg-orange-400 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center w-fit">
//                 <Star size={14} className="mr-1 fill-current" />
//                 {selectedLab.rating}
//               </span>
//             </div>
//             <div className="flex items-center text-gray-500 mt-1">
//               <MapPin size={16} className="mr-1.5" />
//               <p>{selectedLab.location}</p>
//             </div>
//           </div>
//         </div>
//         <div className="text-right flex-col hidden sm:flex">
//           <p className="text-lg font-bold text-gray-800">
//             Appointment Date: {appointmentDate}
//           </p>
//           <p className="text-lg font-bold text-gray-800">
//             Time Slot: {appointmentTime}
//           </p>
//         </div>
//       </div>
//       <div className="text-right sm:hidden mt-4">
//         <p className="text-sm font-bold text-gray-800">
//           Date: {appointmentDate}
//         </p>
//         <p className="text-sm font-bold text-gray-800">
//           Time: {appointmentTime}
//         </p>
//       </div>

//       <div className="border-b border-gray-200 my-6"></div>

//       <div className="mb-6">
//         <div className="relative mb-6">
//           <input
//             type="text"
//             placeholder="Search tests"
//             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37AFA2]"
//           />
//           <Search
//             size={20}
//             className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//           />
//         </div>

//         <h3 className="font-bold text-gray-800 text-lg mb-4">Popular Tests</h3>
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-y-4 gap-x-2">
//           {popularTests.map((test, index) => (
//             <div key={index} className="flex items-center">
//               <input
//                 type="checkbox"
//                 id={test}
//                 name={test}
//                 checked={selectedTests.includes(test)}
//                 onChange={() => handleTestToggle(test)}
//                 className="w-4 h-4 text-[#37AFA2] bg-gray-100 border-gray-300 rounded focus:ring-[#37AFA2]"
//               />
//               <label htmlFor={test} className="ml-2 text-sm text-gray-700">
//                 {test}
//               </label>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="w-full max-w-4xl flex justify-between items-center mt-8 px-2 select-none">
//         <button
//           onClick={onBack}
//           className="bg-[#37AFA2] hover:bg-[#2f9488] transition-colors text-white font-bold py-3 px-6 rounded-lg flex items-center gap-1 shadow-lg cursor-pointer"
//         >
//           <ChevronLeft size={22} />
//           Back
//         </button>
//         <button
//           onClick={handleSelectAddons}
//           disabled={selectedTests.length === 0}
//           className={`py-3 px-6 rounded-lg flex items-center gap-1 shadow-lg font-bold transition-colors cursor-pointer ${
//             selectedTests.length === 0
//               ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//               : 'bg-[#37AFA2] hover:bg-[#2f9488] text-white'
//           }`}
//         >
//           Select Add ons
//           <ChevronRight size={22} />
//         </button>
//       </div>
//     </div>
//   );
// };

// interface AddOnsProps {
//   onBack: () => void;
//   onNext: () => void;
//   selectedLab: Lab;
//   appointmentDate: string;
//   appointmentTime: string;
// }

// const AddOns: React.FC<AddOnsProps> = ({
//   onBack,
//   onNext,
//   selectedLab,
//   appointmentDate,
//   appointmentTime,
// }) => {
//   const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

//   return (
//     <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-black w-full max-w-4xl my-8">
//       <div className="flex items-start justify-between">
//         <div className="flex items-start sm:items-center">
//           <img
//             src={selectedLab.image}
//             alt={selectedLab.name}
//             className="w-16 h-16 rounded-full mr-4 border-2 border-gray-100"
//           />
//           <div>
//             <div className="flex flex-col sm:flex-row sm:items-center">
//               <h2 className="text-xl font-bold text-gray-800">
//                 {selectedLab.name}
//               </h2>
//               <span className="mt-1 sm:mt-0 sm:ml-3 bg-orange-400 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center w-fit">
//                 <Star size={14} className="mr-1 fill-current" />
//                 {selectedLab.rating}
//               </span>
//             </div>
//             <div className="flex items-center text-gray-500 mt-1">
//               <MapPin size={16} className="mr-1.5" />
//               <p>{selectedLab.location}</p>
//             </div>
//           </div>
//         </div>
//         <div className="text-right flex-col hidden sm:flex">
//           <p className="text-lg font-bold text-gray-800">
//             Appointment Date: {appointmentDate}
//           </p>
//           <p className="text-lg font-bold text-gray-800">
//             Time Slot: {appointmentTime}
//           </p>
//         </div>
//       </div>
//       <div className="text-right sm:hidden mt-4">
//         <p className="text-sm font-bold text-gray-800">
//           Date: {appointmentDate}
//         </p>
//         <p className="text-sm font-bold text-gray-800">
//           Time: {appointmentTime}
//         </p>
//       </div>
//       <div className="border-b border-gray-200 my-6"></div>

//       <h3 className="font-bold text-gray-800 text-lg mb-4">Services</h3>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         {[
//           {
//             name: 'Express Delivery',
//             price: 500,
//             description: '(within 2 hrs)',
//           },
//           {
//             name: 'Superfast Delivery',
//             price: 350,
//             description: '(within 6 hrs)',
//           },
//           {
//             name: 'AI health Summary',
//             price: 200,
//             description: '(summary with alerts)',
//           },
//           {
//             name: 'Doctor Suggestion',
//             price: 200,
//             description: '(according to your report)',
//           },
//         ].map((addon, index) => (
//           <button
//             key={index}
//             onClick={() =>
//               setSelectedAddons((prev) =>
//                 prev.includes(addon.name)
//                   ? prev.filter((a) => a !== addon.name)
//                   : [...prev, addon.name]
//               )
//             }
//             className={`flex justify-between items-center p-4 border rounded-lg transition-colors ${
//               selectedAddons.includes(addon.name)
//                 ? 'border-[#37AFA2] bg-teal-50 shadow-md'
//                 : 'border-gray-200 hover:border-teal-400'
//             }`}
//           >
//             <div className="text-left">
//               <p className="font-semibold text-gray-800">{addon.name}</p>
//               <p className="text-sm text-gray-500">{addon.description}</p>
//               <p className="mt-1 font-bold text-[#37AFA2]">+ ₹{addon.price}</p>
//             </div>
//             <div
//               className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
//                 selectedAddons.includes(addon.name)
//                   ? 'border-[#37AFA2] bg-[#37AFA2]'
//                   : 'border-gray-400'
//               }`}
//             >
//               {selectedAddons.includes(addon.name) && (
//                 <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
//               )}
//             </div>
//           </button>
//         ))}
//       </div>

//       <div className="w-full max-w-4xl flex justify-between items-center mt-8 px-2 select-none">
//         <button
//           onClick={onBack}
//           className="bg-[#37AFA2] hover:bg-[#2f9488] transition-colors text-white font-bold py-3 px-6 rounded-lg flex items-center gap-1 shadow-lg cursor-pointer"
//         >
//           <ChevronLeft size={22} />
//           Back
//         </button>
//         <button
//           onClick={onNext}
//           disabled={selectedAddons.length === 0}
//           className={`py-3 px-6 rounded-lg flex items-center gap-1 shadow-lg font-bold transition-colors cursor-pointer ${
//             selectedAddons.length === 0
//               ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//               : 'bg-[#37AFA2] hover:bg-[#2f9488] text-white'
//           }`}
//         >
//           Proceed to Payment
//           <ChevronRight size={22} />
//         </button>
//       </div>
//     </div>
//   );
// };

// const Booking: React.FC = () => {
//   const searchParams = useSearchParams();
//   const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [selectedTime, setSelectedTime] = useState('');
//   const [isLoved, setIsLoved] = useState(false);
//   const [currentStep, setCurrentStep] = useState(1);
//   const [direction, setDirection] = useState(0);

//   useEffect(() => {
//     const labId = searchParams.get('labId');
//     if (labId) {
//       const lab = labsData.find((lab) => lab.id === parseInt(labId));
//       if (lab) {
//         setSelectedLab(lab);
//         setIsLoved(lab.isLoved);

//         if (lab.nextAvailable && lab.nextAvailable !== 'Not Available') {
//           setSelectedDate(new Date(lab.nextAvailable));
//         } else {
//           setSelectedDate(new Date());
//         }

//         const firstAvailableTime = Object.values(lab.timeSlots)
//           .flat()
//           .find((slot) => slot !== '-');
//         if (firstAvailableTime) {
//           setSelectedTime(firstAvailableTime);
//         }
//       }
//     }
//   }, [searchParams]);

//   if (!selectedLab) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center">
//         <p>Loading lab information...</p>
//         <Link href="/BookAppoientment" className="text-[#2A787A] mt-4">
//           Back to labs
//         </Link>
//       </div>
//     );
//   }

//   const handleNextStep = () => {
//     setDirection(1);
//     if (currentStep < 3) {
//       setCurrentStep((prev) => prev + 1);
//     }
//   };

//   const handlePrevStep = () => {
//     setDirection(-1);
//     if (currentStep > 1) {
//       setCurrentStep((prev) => prev - 1);
//     }
//   };

//   const formattedDate = selectedDate.toLocaleDateString('en-GB', {
//     day: '2-digit',
//     month: '2-digit',
//     year: 'numeric',
//   });

//   const isStep1Complete = selectedDate && selectedTime;

//   const variants = {
//     enter: (direction: number) => ({
//       x: direction > 0 ? 1000 : -1000,
//       opacity: 0,
//     }),
//     center: { x: 0, opacity: 1 },
//     exit: (direction: number) => ({
//       x: direction < 0 ? 1000 : -1000,
//       opacity: 0,
//     }),
//   };

//   return (
//     <>
//       <main
//         className="min-h-screen flex flex-col text-white select-none"
//         style={{
//           background:
//             'linear-gradient(180deg, #05303B -14.4%, #2B7C7E 11.34%, #91D8C1 55.01%, #FFF 100%)',
//         }}
//       >
//         <Navbar />
//         <div className="flex-grow flex flex-col items-center justify-center p-4 my-8">
//           <Stepper currentStep={currentStep} />

//           <AnimatePresence mode="wait" custom={direction}>
//             {currentStep === 1 && (
//               <motion.div
//                 key="step1"
//                 custom={direction}
//                 variants={variants}
//                 initial="enter"
//                 animate="center"
//                 exit="exit"
//                 transition={{
//                   x: { type: 'spring', stiffness: 300, damping: 30 },
//                   opacity: { duration: 0.2 },
//                 }}
//                 className="w-full max-w-4xl"
//               >
//                 <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-black w-full max-w-4xl my-8">
//                   <div className="flex items-start sm:items-center">
//                     <img
//                       src={selectedLab.image}
//                       alt={selectedLab.name}
//                       className="w-16 h-16 rounded-full mr-4 border-2 border-gray-100"
//                     />
//                     <div>
//                       <div className="flex flex-col sm:flex-row sm:items-center">
//                         <h2 className="text-xl font-bold text-gray-800">
//                           {selectedLab.name}
//                         </h2>
//                         <span className="mt-1 sm:mt-0 sm:ml-3 bg-orange-400 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center w-fit">
//                           <Star size={14} className="mr-1 fill-current" />{' '}
//                           {selectedLab.rating}
//                         </span>
//                       </div>
//                       <div className="flex items-center text-gray-500 mt-1">
//                         <MapPin size={16} className="mr-1.5" />
//                         <p>{selectedLab.location}</p>
//                         <button
//                           onClick={() => setIsLoved(!isLoved)}
//                           className="ml-4"
//                         >
//                           <Heart
//                             size={20}
//                             className={
//                               isLoved
//                                 ? 'text-red-500 fill-current'
//                                 : 'text-gray-400'
//                             }
//                           />
//                         </button>
//                       </div>
//                       <div className="mt-1 text-sm text-gray-500">
//                         {selectedLab.experience} Years of Experience |{' '}
//                         {selectedLab.testType}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="border-b border-gray-200 my-6"></div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
//                     <div>
//                       <h3 className="font-bold text-gray-800 text-lg mb-4">
//                         Select Date
//                       </h3>
//                       <Calendar
//                         selectedDate={selectedDate}
//                         onDateChange={setSelectedDate}
//                       />
//                     </div>

//                     <div>
//                       <h3 className="font-bold text-gray-800 text-lg mb-4">
//                         Select Time Slot
//                       </h3>
//                       <TimeSlots
//                         selectedTime={selectedTime}
//                         onTimeChange={setSelectedTime}
//                         timeSlots={selectedLab.timeSlots}
//                       />
//                     </div>
//                   </div>

//                   <div className="w-full max-w-4xl flex justify-between items-center mt-8 px-2 select-none">
//                     <Link
//                       href="/BookAppoientment"
//                       className="bg-[#37AFA2] hover:bg-[#2f9488] transition-colors text-white font-bold py-3 px-6 rounded-lg flex items-center gap-1 shadow-lg cursor-pointer"
//                     >
//                       <ChevronLeft size={22} />
//                       Back
//                     </Link>
//                     <button
//                       onClick={handleNextStep}
//                       disabled={!isStep1Complete}
//                       className={`py-3 px-6 rounded-lg flex items-center gap-1 shadow-lg font-bold transition-colors cursor-pointer ${
//                         !isStep1Complete
//                           ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                           : 'bg-[#37AFA2] hover:bg-[#2f9488] text-white'
//                       }`}
//                     >
//                       Select Tests
//                       <ChevronRight size={22} />
//                     </button>
//                   </div>
//                 </div>
//               </motion.div>
//             )}

//             {currentStep === 2 && (
//               <motion.div
//                 key="step2"
//                 custom={direction}
//                 variants={variants}
//                 initial="enter"
//                 animate="center"
//                 exit="exit"
//                 transition={{
//                   x: { type: 'spring', stiffness: 300, damping: 30 },
//                   opacity: { duration: 0.2 },
//                 }}
//                 className="w-full max-w-4xl"
//               >
//                 <TestSelection
//                   onBack={handlePrevStep}
//                   onNext={handleNextStep}
//                   selectedLab={selectedLab}
//                   appointmentDate={formattedDate}
//                   appointmentTime={selectedTime}
//                 />
//               </motion.div>
//             )}

//             {currentStep === 3 && (
//               <motion.div
//                 key="step3"
//                 custom={direction}
//                 variants={variants}
//                 initial="enter"
//                 animate="center"
//                 exit="exit"
//                 transition={{
//                   x: { type: 'spring', stiffness: 300, damping: 30 },
//                   opacity: { duration: 0.2 },
//                 }}
//                 className="w-full max-w-4xl"
//               >
//                 <AddOns
//                   onBack={handlePrevStep}
//                   onNext={handleNextStep}
//                   selectedLab={selectedLab}
//                   appointmentDate={formattedDate}
//                   appointmentTime={selectedTime}
//                 />
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </main>
//       <Footer />
//     </>
//   );
// };

// export default Booking;

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Heart,
  Search,
} from 'lucide-react';
import { labsData, allLabTests } from '@/data/labsData';
import { motion, AnimatePresence } from 'framer-motion';
import Stepper from '@/components/stepper';
import Calendar from '@/components/calendar';

interface Lab {
  id: number;
  name: string;
  testType: string;
  location: string;
  nextAvailable: string;
  rating: number;
  experience: number;
  isLoved: boolean;
  image: string;
  collectionTypes: string[];
  timeSlots: {
    Morning: string[];
    Afternoon: string[];
    Evening: string[];
  };
}

interface TimeSlotsProps {
  selectedTime: string;
  onTimeChange: (time: string) => void;
  timeSlots: {
    Morning: string[];
    Afternoon: string[];
    Evening: string[];
  };
}

const TimeSlots = ({
  selectedTime,
  onTimeChange,
  timeSlots,
}: TimeSlotsProps) => {
  return (
    <div className="space-y-5">
      {Object.entries(timeSlots).map(([period, slots]) => (
        <div key={period}>
          <p className="text-sm font-medium text-gray-500 mb-2">{period}</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-sm">
            {slots.map((time, i) => {
              const isDisabled = time === '-';
              const isSelected = selectedTime === time;
              return (
                <button
                  key={i}
                  disabled={isDisabled}
                  onClick={() => onTimeChange(time)}
                  className={`p-2 border rounded-md transition-colors ${
                    isDisabled
                      ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                      : isSelected
                        ? 'border-transparent bg-[#37AFA2] text-white font-semibold'
                        : 'border-gray-200 hover:border-teal-400'
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

interface TestSelectionProps {
  onBack: () => void;
  onNext: () => void;
  selectedLab: Lab;
  appointmentDate: string;
  appointmentTime: string;
}

const TestSelection = ({
  onBack,
  onNext,
  selectedLab,
  appointmentDate,
  appointmentTime,
}: TestSelectionProps) => {
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const popularTests = Object.values(allLabTests).flat().slice(0, 10);

  const handleTestToggle = (testName: string) => {
    setSelectedTests((prev) =>
      prev.includes(testName)
        ? prev.filter((test) => test !== testName)
        : [...prev, testName]
    );
  };

  const handleSelectAddons = () => {
    console.log('Selected Tests:', selectedTests);
    onNext();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-black w-full max-w-4xl my-8">
      <div className="flex items-start justify-between">
        <div className="flex items-start sm:items-center">
          <img
            src={selectedLab.image}
            alt={selectedLab.name}
            className="w-16 h-16 rounded-full mr-4 border-2 border-gray-100"
          />
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center">
              <h2 className="text-xl font-bold text-gray-800">
                {selectedLab.name}
              </h2>
              <span className="mt-1 sm:mt-0 sm:ml-3 bg-orange-400 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center w-fit">
                <Star size={14} className="mr-1 fill-current" />
                {selectedLab.rating}
              </span>
            </div>
            <div className="flex items-center text-gray-500 mt-1">
              <MapPin size={16} className="mr-1.5" />
              <p>{selectedLab.location}</p>
            </div>
          </div>
        </div>
        <div className="text-right flex-col hidden sm:flex">
          <p className="text-lg font-bold text-gray-800">
            Appointment Date: {appointmentDate}
          </p>
          <p className="text-lg font-bold text-gray-800">
            Time Slot: {appointmentTime}
          </p>
        </div>
      </div>
      <div className="text-right sm:hidden mt-4">
        <p className="text-sm font-bold text-gray-800">
          Date: {appointmentDate}
        </p>
        <p className="text-sm font-bold text-gray-800">
          Time: {appointmentTime}
        </p>
      </div>

      <div className="border-b border-gray-200 my-6"></div>

      <div className="mb-6">
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search tests"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37AFA2]"
          />
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>

        <h3 className="font-bold text-gray-800 text-lg mb-4">Popular Tests</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-y-4 gap-x-2">
          {popularTests.map((test, index) => (
            <div key={index} className="flex items-center">
              <input
                type="checkbox"
                id={test}
                name={test}
                checked={selectedTests.includes(test)}
                onChange={() => handleTestToggle(test)}
                className="w-4 h-4 text-[#37AFA2] bg-gray-100 border-gray-300 rounded focus:ring-[#37AFA2]"
              />
              <label htmlFor={test} className="ml-2 text-sm text-gray-700">
                {test}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-4xl flex flex-col sm:flex-row justify-between items-center mt-8 px-2 select-none gap-4 sm:gap-0">
        <button
          onClick={onBack}
          className="w-full sm:w-auto bg-[#37AFA2] hover:bg-[#2f9488] transition-colors text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-1 shadow-lg cursor-pointer"
        >
          <ChevronLeft size={22} />
          Back
        </button>
        <button
          onClick={handleSelectAddons}
          disabled={selectedTests.length === 0}
          className={`w-full sm:w-auto py-3 px-6 rounded-lg flex items-center justify-center gap-1 shadow-lg font-bold transition-colors cursor-pointer ${
            selectedTests.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#37AFA2] hover:bg-[#2f9488] text-white'
          }`}
        >
          Select Add ons
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );
};

interface AddOnsProps {
  onBack: () => void;
  onNext: () => void;
  selectedLab: Lab;
  appointmentDate: string;
  appointmentTime: string;
}

const AddOns = ({
  onBack,
  onNext,
  selectedLab,
  appointmentDate,
  appointmentTime,
}: AddOnsProps) => {
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-black w-full max-w-4xl my-8">
      <div className="flex items-start justify-between">
        <div className="flex items-start sm:items-center">
          <img
            src={selectedLab.image}
            alt={selectedLab.name}
            className="w-16 h-16 rounded-full mr-4 border-2 border-gray-100"
          />
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center">
              <h2 className="text-xl font-bold text-gray-800">
                {selectedLab.name}
              </h2>
              <span className="mt-1 sm:mt-0 sm:ml-3 bg-orange-400 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center w-fit">
                <Star size={14} className="mr-1 fill-current" />
                {selectedLab.rating}
              </span>
            </div>
            <div className="flex items-center text-gray-500 mt-1">
              <MapPin size={16} className="mr-1.5" />
              <p>{selectedLab.location}</p>
            </div>
          </div>
        </div>
        <div className="text-right flex-col hidden sm:flex">
          <p className="text-lg font-bold text-gray-800">
            Appointment Date: {appointmentDate}
          </p>
          <p className="text-lg font-bold text-gray-800">
            Time Slot: {appointmentTime}
          </p>
        </div>
      </div>
      <div className="text-right sm:hidden mt-4">
        <p className="text-sm font-bold text-gray-800">
          Date: {appointmentDate}
        </p>
        <p className="text-sm font-bold text-gray-800">
          Time: {appointmentTime}
        </p>
      </div>
      <div className="border-b border-gray-200 my-6"></div>

      <h3 className="font-bold text-gray-800 text-lg mb-4">Services</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            name: 'Express Delivery',
            price: 500,
            description: '(within 2 hrs)',
          },
          {
            name: 'Superfast Delivery',
            price: 350,
            description: '(within 6 hrs)',
          },
          {
            name: 'AI health Summary',
            price: 200,
            description: '(summary with alerts)',
          },
          {
            name: 'Doctor Suggestion',
            price: 200,
            description: '(according to your report)',
          },
        ].map((addon, index) => (
          <button
            key={index}
            onClick={() =>
              setSelectedAddons((prev) =>
                prev.includes(addon.name)
                  ? prev.filter((a) => a !== addon.name)
                  : [...prev, addon.name]
              )
            }
            className={`flex justify-between items-center p-4 border rounded-lg transition-colors ${
              selectedAddons.includes(addon.name)
                ? 'border-[#37AFA2] bg-teal-50 shadow-md'
                : 'border-gray-200 hover:border-teal-400'
            }`}
          >
            <div className="text-left">
              <p className="font-semibold text-gray-800">{addon.name}</p>
              <p className="text-sm text-gray-500">{addon.description}</p>
              <p className="mt-1 font-bold text-[#37AFA2]">+ ₹{addon.price}</p>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                selectedAddons.includes(addon.name)
                  ? 'border-[#37AFA2] bg-[#37AFA2]'
                  : 'border-gray-400'
              }`}
            >
              {selectedAddons.includes(addon.name) && (
                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="w-full max-w-4xl flex flex-col sm:flex-row justify-between items-center mt-8 px-2 select-none gap-4 sm:gap-0">
        <button
          onClick={onBack}
          className="w-full sm:w-auto bg-[#37AFA2] hover:bg-[#2f9488] transition-colors text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-1 shadow-lg cursor-pointer"
        >
          <ChevronLeft size={22} />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={selectedAddons.length === 0}
          className={`w-full sm:w-auto py-3 px-6 rounded-lg flex items-center justify-center gap-1 shadow-lg font-bold transition-colors cursor-pointer ${
            selectedAddons.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#37AFA2] hover:bg-[#2f9488] text-white'
          }`}
        >
          Proceed to Payment
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );
};

const Booking = () => {
  const searchParams = useSearchParams();
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [isLoved, setIsLoved] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const labId = searchParams.get('labId');
    if (labId) {
      const lab = labsData.find((lab) => lab.id === parseInt(labId));
      if (lab) {
        setSelectedLab(lab);
        setIsLoved(lab.isLoved);

        if (lab.nextAvailable && lab.nextAvailable !== 'Not Available') {
          setSelectedDate(new Date(lab.nextAvailable));
        } else {
          setSelectedDate(new Date());
        }

        const firstAvailableTime = Object.values(lab.timeSlots)
          .flat()
          .find((slot) => slot !== '-');
        if (firstAvailableTime) {
          setSelectedTime(firstAvailableTime);
        }
      }
    }
  }, [searchParams]);

  if (!selectedLab) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p>Loading lab information...</p>
        <Link href="/BookAppoientment" className="text-[#2A787A] mt-4">
          Back to labs
        </Link>
      </div>
    );
  }

  const handleNextStep = () => {
    setDirection(1);
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setDirection(-1);
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const formattedDate = selectedDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const isStep1Complete = selectedDate && selectedTime;

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <>
      <main
        className="min-h-screen flex flex-col text-white select-none"
        style={{
          background:
            'linear-gradient(180deg, #05303B -14.4%, #2B7C7E 11.34%, #91D8C1 55.01%, #FFF 100%)',
        }}
      >
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-4 my-8">
          <Stepper currentStep={currentStep} />

          <AnimatePresence mode="wait" custom={direction}>
            {currentStep === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="w-full max-w-4xl"
              >
                <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-black w-full max-w-4xl my-8">
                  <div className="flex items-start sm:items-center">
                    <img
                      src={selectedLab.image}
                      alt={selectedLab.name}
                      className="w-16 h-16 rounded-full mr-4 border-2 border-gray-100"
                    />
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <h2 className="text-xl font-bold text-gray-800">
                          {selectedLab.name}
                        </h2>
                        <span className="mt-1 sm:mt-0 sm:ml-3 bg-orange-400 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center w-fit">
                          <Star size={14} className="mr-1 fill-current" />{' '}
                          {selectedLab.rating}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-500 mt-1">
                        <MapPin size={16} className="mr-1.5" />
                        <p>{selectedLab.location}</p>
                        <button
                          onClick={() => setIsLoved(!isLoved)}
                          className="ml-4"
                        >
                          <Heart
                            size={20}
                            className={
                              isLoved
                                ? 'text-red-500 fill-current'
                                : 'text-gray-400'
                            }
                          />
                        </button>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        {selectedLab.experience} Years of Experience |{' '}
                        {selectedLab.testType}
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-gray-200 my-6"></div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg mb-4">
                        Select Date
                      </h3>
                      <Calendar
                        selectedDate={selectedDate}
                        onDateChange={setSelectedDate}
                      />
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-800 text-lg mb-4">
                        Select Time Slot
                      </h3>
                      <TimeSlots
                        selectedTime={selectedTime}
                        onTimeChange={setSelectedTime}
                        timeSlots={selectedLab.timeSlots}
                      />
                    </div>
                  </div>

                  <div className="w-full max-w-4xl flex justify-between items-center mt-8 px-2 select-none">
                    <Link
                      href="/BookAppoientment"
                      className="bg-[#37AFA2] hover:bg-[#2f9488] transition-colors text-white font-bold py-3 px-6 rounded-lg flex items-center gap-1 shadow-lg cursor-pointer"
                    >
                      <ChevronLeft size={22} />
                      Back
                    </Link>
                    <button
                      onClick={handleNextStep}
                      disabled={!isStep1Complete}
                      className={`py-3 px-6 rounded-lg flex items-center gap-1 shadow-lg font-bold transition-colors cursor-pointer ${
                        !isStep1Complete
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-[#37AFA2] hover:bg-[#2f9488] text-white'
                      }`}
                    >
                      Select Tests
                      <ChevronRight size={22} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="w-full max-w-4xl"
              >
                <TestSelection
                  onBack={handlePrevStep}
                  onNext={handleNextStep}
                  selectedLab={selectedLab}
                  appointmentDate={formattedDate}
                  appointmentTime={selectedTime}
                />
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="w-full max-w-4xl"
              >
                <AddOns
                  onBack={handlePrevStep}
                  onNext={handleNextStep}
                  selectedLab={selectedLab}
                  appointmentDate={formattedDate}
                  appointmentTime={selectedTime}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Booking;
