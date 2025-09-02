//app/(patient)/Booking/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import Stepper from '@/components/stepper';
import Calendar from '@/components/calendar';
import Link from 'next/link';
import { Star, MapPin, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  AddOns,
  Payment,
  TestSelection,
  PatientDetails,
  TimeSlots,
  Confirmation,
} from '@/components/Booking';
import Image from 'next/image';

export default function Booking() {
  const searchParams = useSearchParams();
  const supabase = createSupabaseBrowserClient();

  const [selectedLab, setSelectedLab] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [isLoved, setIsLoved] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [patientDetails, setPatientDetails] = useState<any>({});
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase.auth]);

  useEffect(() => {
    const labId = searchParams.get('labId');

    const fetchLabData = async () => {
      if (!labId) return;

      const { data: lab, error } = await supabase
        .from('labs')
        .select(
          `
            id,
            labLocation,
            details:lab_details (
                labName,
                imageUrl,
                rating,
                isLoved,
                experienceYears,
                testType,
                nextAvailable
            ),
            timeSlots:lab_time_slots (
                time,
                session
            )
        `
        )
        .eq('id', labId)
        .single();

      if (error || !lab) {
        console.error('Error fetching lab data:', error);
        setSelectedLab(null);
        return;
      }

      const labDetails = Array.isArray(lab.details)
        ? lab.details[0]
        : lab.details;

      const processedTimeSlots: {
        Morning: string[];
        Afternoon: string[];
        Evening: string[];
      } = { Morning: [], Afternoon: [], Evening: [] };
      if (lab.timeSlots) {
        lab.timeSlots.forEach((slot: { time: string; session: string }) => {
          switch (slot.session) {
            case 'MORNING':
              processedTimeSlots.Morning.push(slot.time);
              break;
            case 'AFTERNOON':
              processedTimeSlots.Afternoon.push(slot.time);
              break;
            case 'EVENING':
              processedTimeSlots.Evening.push(slot.time);
              break;
          }
        });
      }

      const processedLab = {
        id: lab.id,
        name: labDetails?.labName || 'N/A',
        location: lab.labLocation,
        image: labDetails?.imageUrl || '/default-image.png',
        rating: labDetails?.rating || 0,
        isLoved: labDetails?.isLoved || false,
        experience: labDetails?.experienceYears || 0,
        testType: labDetails?.testType || 'N/A',
        nextAvailable: labDetails?.nextAvailable,
        timeSlots: processedTimeSlots,
      };

      setSelectedLab(processedLab);
      setIsLoved(processedLab.isLoved);

      if (
        processedLab.nextAvailable &&
        processedLab.nextAvailable !== 'Not Available'
      ) {
        setSelectedDate(new Date(processedLab.nextAvailable));
      } else {
        setSelectedDate(new Date());
      }

      const firstAvailableTime = Object.values(processedLab.timeSlots)
        .flat()
        .find((slot) => slot !== '-');
      if (firstAvailableTime) {
        setSelectedTime(firstAvailableTime);
      }
    };

    fetchLabData();
  }, [searchParams, supabase]);

  if (!selectedLab) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p>Loading lab information...</p>
        <Link href="/BookAppointment" className="text-[#2A787A] mt-4">
          Back to labs
        </Link>
      </div>
    );
  }

  const handleNextStep = () => {
    setDirection(1);
    if (currentStep < 6) {
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
                    <Image
                      src={selectedLab.image}
                      alt={selectedLab.name}
                      width={64}
                      height={64}
                      className="rounded-full mr-4 border-2 border-gray-100"
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

                  <div className="w-full max-w-4xl flex flex-col sm:flex-row justify-between items-center mt-8 px-2 select-none gap-4 sm:gap-0">
                    <Link
                      href="/BookAppointment"
                      className="bg-[#37AFA2] hover:bg-[#2f9488] transition-colors text-white font-bold py-3 px-6 rounded-lg flex items-center gap-1 shadow-lg cursor-pointer w-full sm:w-auto justify-center"
                    >
                      <ChevronLeft size={22} />
                      Back
                    </Link>
                    <button
                      onClick={handleNextStep}
                      disabled={!isStep1Complete}
                      className={`py-3 px-6 rounded-lg flex items-center gap-1 shadow-lg font-bold transition-colors cursor-pointer w-full sm:w-auto justify-center ${
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

            {/* All other steps remain unchanged */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                {...{
                  custom: direction,
                  variants,
                  initial: 'enter',
                  animate: 'center',
                  exit: 'exit',
                  transition: {
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  },
                  className: 'w-full max-w-4xl',
                }}
              >
                <TestSelection
                  onBack={handlePrevStep}
                  onNext={handleNextStep}
                  selectedLab={selectedLab}
                  appointmentDate={formattedDate}
                  appointmentTime={selectedTime}
                  selectedTests={selectedTests}
                  onTestsChange={setSelectedTests}
                />
              </motion.div>
            )}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                {...{
                  custom: direction,
                  variants,
                  initial: 'enter',
                  animate: 'center',
                  exit: 'exit',
                  transition: {
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  },
                  className: 'w-full max-w-4xl',
                }}
              >
                <PatientDetails
                  onBack={handlePrevStep}
                  onNext={handleNextStep}
                  selectedLab={selectedLab}
                  appointmentDate={formattedDate}
                  appointmentTime={selectedTime}
                  patientDetails={patientDetails}
                  onPatientDetailsChange={setPatientDetails}
                />
              </motion.div>
            )}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                {...{
                  custom: direction,
                  variants,
                  initial: 'enter',
                  animate: 'center',
                  exit: 'exit',
                  transition: {
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  },
                  className: 'w-full max-w-4xl',
                }}
              >
                <AddOns
                  onBack={handlePrevStep}
                  onNext={handleNextStep}
                  selectedLab={selectedLab}
                  appointmentDate={formattedDate}
                  appointmentTime={selectedTime}
                  selectedAddons={selectedAddons}
                  onAddonsChange={setSelectedAddons}
                />
              </motion.div>
            )}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                {...{
                  custom: direction,
                  variants,
                  initial: 'enter',
                  animate: 'center',
                  exit: 'exit',
                  transition: {
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  },
                  className: 'w-full max-w-4xl',
                }}
              >
                <Payment
                  onBack={handlePrevStep}
                  onNext={handleNextStep}
                  selectedLab={selectedLab}
                  appointmentDate={formattedDate}
                  appointmentTime={selectedTime}
                  selectedTests={selectedTests}
                  selectedAddons={selectedAddons}
                  patientDetails={patientDetails}
                />
              </motion.div>
            )}
            {currentStep === 6 && (
              <motion.div
                key="step6"
                {...{
                  custom: direction,
                  variants,
                  initial: 'enter',
                  animate: 'center',
                  exit: 'exit',
                  transition: {
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  },
                  className: 'w-full max-w-4xl',
                }}
              >
                <Confirmation
                  selectedLab={selectedLab}
                  appointmentDate={formattedDate}
                  appointmentTime={selectedTime}
                  selectedTests={selectedTests}
                  selectedAddons={selectedAddons}
                  authUser={user}
                  patientDetails={patientDetails}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  );
}
