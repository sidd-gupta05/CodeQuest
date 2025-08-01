'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { ChevronLeft, ChevronRight, Star, MapPin, Heart } from 'lucide-react';
import { labsData } from '@/data/labsData';

interface Lab {
  id: number;
  name: string;
  testType: string;
  location: string;
  nextAvailable: string;
  rating: number;
  votes: number;
  totalVotes: number;
  experience: number;
  isAvailable: boolean;
  isLoved: boolean;
  image: string;
  collectionTypes: string[];
  timeSlots: {
    Morning: string[];
    Afternoon: string[];
    Evening: string[];
  };
}

const Stepper = () => {
  const steps = [
    { number: 1, title: 'Date & Time', active: true },
    { number: 2, title: 'Test Selection', active: false },
    { number: 3, title: 'Add ons', active: false },
    { number: 4, title: 'Payment', active: false },
    { number: 5, title: 'Confirmation', active: false },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-0">
      {/* Small screens: show only active step */}
      <div className="flex items-center justify-center my-8 sm:hidden">
        {steps.map(
          (step) =>
            step.active && (
              <div key={step.number} className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold bg-[#37AFA2] text-white">
                  {step.number}
                </div>
                <p className="mt-2 text-xs text-center font-semibold text-white">
                  {step.title}
                </p>
              </div>
            )
        )}
      </div>

      {/* Large screens: full stepper */}
      <div className="hidden sm:flex items-center my-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                  step.active
                    ? 'bg-[#37AFA2] text-white'
                    : 'border-2 border-gray-300 text-gray-300'
                }`}
              >
                {step.number}
              </div>
              <p
                className={`mt-2 text-xs sm:text-sm text-center font-semibold transition-all duration-300 ${
                  step.active ? 'text-white' : 'text-gray-300'
                }`}
              >
                {step.title}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 border-t-2 border-dashed border-gray-300 mx-2 sm:mx-4"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const Calendar = ({ selectedDate, onDateChange }) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const calendarDays = [];

    for (let i = 0; i < firstDay; i++) {
      calendarDays.push({ day: null, isCurrentMonth: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push({ day, isCurrentMonth: true });
    }

    return calendarDays;
  };

  const calendarDays = generateCalendarDays();
  const monthYearString = new Date(currentYear, currentMonth).toLocaleString(
    'default',
    { month: 'long', year: 'numeric' }
  );

  return (
    <div className="w-full text-gray-700">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft size={20} />
        </button>
        <h4 className="font-bold text-lg">{monthYearString}</h4>
        <button
          onClick={handleNextMonth}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-y-2 text-center text-sm">
        {daysOfWeek.map((day) => (
          <div key={day} className="font-medium text-gray-400">
            {day}
          </div>
        ))}
        {calendarDays.map((date, i) => {
          if (!date.isCurrentMonth) {
            return <div key={i}></div>;
          }
          const isSelected =
            selectedDate.getDate() === date.day &&
            selectedDate.getMonth() === currentMonth &&
            selectedDate.getFullYear() === currentYear;
          return (
            <div
              key={i}
              onClick={() =>
                onDateChange(new Date(currentYear, currentMonth, date.day))
              }
              className={`flex items-center justify-center w-9 h-9 mx-auto rounded-full cursor-pointer ${isSelected ? 'bg-[#37AFA2] text-white font-semibold' : 'hover:bg-gray-100'}`}
            >
              {date.day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

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

const Booking = () => {
  const searchParams = useSearchParams();
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('09:45');
  const [isLoved, setIsLoved] = useState(false);

  useEffect(() => {
    const labId = searchParams.get('labId');
    if (labId) {
      const lab = labsData.find((lab) => lab.id === parseInt(labId));
      if (lab) {
        setSelectedLab(lab);
        setIsLoved(lab.isLoved);
        setSelectedDate(new Date(lab.nextAvailable));
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

  const handleSelectTests = () => {
    console.log('Booking Details:');
    console.log('Lab:', selectedLab.name);
    console.log('Selected Date:', selectedDate.toDateString());
    console.log('Selected Time Slot:', selectedTime);
    // Add navigation to next step here
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
          <Stepper />
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-black w-full max-w-4xl my-8">
            {/* Lab Info */}
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
                  <button onClick={() => setIsLoved(!isLoved)} className="ml-4">
                    <Heart
                      size={20}
                      className={
                        isLoved ? 'text-red-500 fill-current' : 'text-gray-400'
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
                onClick={handleSelectTests}
                className="bg-[#37AFA2] hover:bg-[#2f9488] transition-colors text-white font-bold py-3 px-6 rounded-lg flex items-center gap-1 shadow-lg cursor-pointer"
              >
                Select Tests
                <ChevronRight size={22} />
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Booking;
