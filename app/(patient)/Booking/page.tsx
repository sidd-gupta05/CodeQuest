// app/(patient)/Booking/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
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
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function Booking() {
  const searchParams = useSearchParams();
  const router = useRouter();
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
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session) {
          router.push('/login');
          return;
        }

        setAuthChecked(true);

        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          setPatientDetails((prev: any) => ({
            ...prev,
            name:
              user.user_metadata?.full_name || user.user_metadata?.name || '',
            email: user.email || '',
            phone: '',
          }));
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [supabase.auth, router]);

  useEffect(() => {
    if (!authChecked) return; // Wait until auth check is complete

    const labId = searchParams.get('labId');
    const fetchLabData = async () => {
      if (!labId) return;

      setLoading(true);
      try {
        const response = await fetch(`/api/lab/${labId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch lab data');
        }

        const lab = await response.json();

        const processedLab = {
          id: lab.id,
          name: lab.name || 'N/A',
          location: lab.location,
          image: lab.image || '/default-image.png',
          rating: lab.rating || 0,
          isLoved: false,
          experience: 0,
          testType: lab.testType || 'N/A',
          nextAvailable: lab.nextAvailable,
          timeSlots: lab.timeSlots || {
            Morning: [],
            Afternoon: [],
            Evening: [],
          },
        };

        setSelectedLab(processedLab);
        setIsLoved(false);

        if (
          processedLab.nextAvailable &&
          processedLab.nextAvailable !== 'Not Available'
        ) {
          setSelectedDate(new Date(processedLab.nextAvailable));
        }

        const firstAvailableTime = Object.values(processedLab.timeSlots)
          .flat()
          .find((slot) => typeof slot === 'string' && slot !== '-');
        if (typeof firstAvailableTime === 'string') {
          setSelectedTime(firstAvailableTime);
        }
      } catch (error) {
        console.error('Error fetching lab data:', error);
        setSelectedLab(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLabData();
  }, [searchParams, authChecked]);

  // Show loading until auth check is complete
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#05303B] via-[#2B7C7E] to-[#91D8C1]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#37AFA2] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white/90 text-sm">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#05303B] via-[#2B7C7E] to-[#91D8C1]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#37AFA2] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white/90 text-sm">Loading lab details...</p>
        </div>
      </div>
    );
  }

  if (!selectedLab) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p>Failed to load lab information.</p>
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

                  {/* // Page 1 */}
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
                  user={user} // Pass the user object here
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
