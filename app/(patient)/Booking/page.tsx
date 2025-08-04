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
import Image from 'next/image';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const allTestsWithCategory = Object.entries(allLabTests).flatMap(
    ([category, tests]) => tests.map((test) => ({ category, name: test }))
  );

  const filteredTests = allTestsWithCategory.filter(({ category, name }) => {
    const matchesSearch = name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory
      ? category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const testsByCategory = filteredTests.reduce(
    (acc, { category, name }) => {
      if (!acc[category]) acc[category] = [];
      acc[category].push(name);
      return acc;
    },
    {} as Record<string, string[]>
  );

  const handleTestToggle = (testName: string) => {
    setSelectedTests((prev) =>
      prev.includes(testName)
        ? prev.filter((test) => test !== testName)
        : [...prev, testName]
    );
  };

  const handleSelectAddons = () => {
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37AFA2]"
          />
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedCategory === null
                ? 'bg-[#37AFA2] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Categories
          </button>
          {Object.keys(allLabTests).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCategory === category
                  ? 'bg-[#37AFA2] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {Object.entries(testsByCategory).length > 0 ? (
          Object.entries(testsByCategory).map(([category, tests]) => (
            <div key={category} className="mb-6">
              <h3 className="font-bold text-gray-800 text-lg mb-3">
                {category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4">
                {tests.map((test, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`test-${index}`}
                      checked={selectedTests.includes(test)}
                      onChange={() => handleTestToggle(test)}
                      className="w-4 h-4 text-[#37AFA2] bg-gray-100 border-gray-300 rounded focus:ring-[#37AFA2]"
                    />
                    <label
                      htmlFor={`test-${index}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {test}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">
            No tests found matching your search.
          </p>
        )}
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
          Continue to Patient Details
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );
};

interface PatientDetailsProps {
  onBack: () => void;
  onNext: () => void;
  selectedLab: Lab;
  appointmentDate: string;
  appointmentTime: string;
}

const PatientDetails = ({
  onBack,
  onNext,
  selectedLab,
  appointmentDate,
  appointmentTime,
}: PatientDetailsProps) => {
  const [patientData, setPatientData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    age: '',
    address: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPatientData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid =
    patientData.firstName &&
    patientData.lastName &&
    patientData.gender &&
    patientData.age &&
    patientData.address;

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

      <h3 className="font-bold text-gray-800 text-lg mb-6">Patient Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            First Name*
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={patientData.firstName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37AFA2]"
            required
          />
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Last Name*
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={patientData.lastName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37AFA2]"
            required
          />
        </div>

        <div>
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Gender*
          </label>
          <select
            id="gender"
            name="gender"
            value={patientData.gender}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37AFA2]"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="age"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Age*
          </label>
          <input
            type="number"
            id="age"
            name="age"
            min="0"
            max="120"
            value={patientData.age}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37AFA2]"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Address*
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={patientData.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37AFA2]"
            required
          />
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
          onClick={onNext}
          disabled={!isFormValid}
          className={`w-full sm:w-auto py-3 px-6 rounded-lg flex items-center justify-center gap-1 shadow-lg font-bold transition-colors cursor-pointer ${
            !isFormValid
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#37AFA2] hover:bg-[#2f9488] text-white'
          }`}
        >
          Continue to Add Ons
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

interface PaymentProps {
  onBack: () => void;
  onNext: () => void;
  selectedLab: Lab;
  appointmentDate: string;
  appointmentTime: string;
  selectedTests: string[];
  selectedAddons: string[];
}

const Payment = ({
  onBack,
  onNext,
  selectedLab,
  appointmentDate,
  appointmentTime,
  selectedTests,
  selectedAddons,
}: PaymentProps) => {
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Add the loadScript function here
  const loadScript = (src: string) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Calculate total amount
  const calculateTotal = () => {
    const testCost = selectedTests.length * 500; // ₹500 per test
    const addonCost = selectedAddons.reduce((total, addon) => {
      if (addon === 'Express Delivery') return total + 500;
      if (addon === 'Superfast Delivery') return total + 350;
      return total + 200; // Default for other add-ons
    }, 0);
    return testCost + addonCost;
  };

  const totalAmount = calculateTotal();

  const initializeRazorpayPayment = async () => {
    setPaymentLoading(true);

    try {
      // Load Razorpay script
      const res = await loadScript(
        'https://checkout.razorpay.com/v1/checkout.js'
      );
      if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        return;
      }

      // Create order on your backend
      const response = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount * 100, // Razorpay expects amount in paise
          currency: 'INR',
          receipt: `lab_${selectedLab.id}_${Date.now()}`,
        }),
      });

      const orderData = await response.json();

      if (!orderData.id) {
        throw new Error('Failed to create order');
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount.toString(),
        currency: orderData.currency,
        name: 'HealthCare Labs',
        description: 'Lab Test Booking Payment',
        order_id: orderData.id,
        handler: async function (response: any) {
          // Verify payment on your backend
          const verificationResponse = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verificationData = await verificationResponse.json();

          if (verificationData.success) {
            onNext(); // Move to confirmation step
          } else {
            alert('Payment verification failed. Please contact support.');
          }
        },
        theme: {
          color: '#37AFA2',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-black w-full max-w-4xl my-8">
      {/* ... rest of your payment component UI ... */}
      <button
        onClick={initializeRazorpayPayment}
        disabled={paymentLoading || totalAmount === 0}
        className={`w-full sm:w-auto py-3 px-6 rounded-lg flex items-center justify-center gap-1 shadow-lg font-bold transition-colors cursor-pointer ${
          paymentLoading || totalAmount === 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-[#37AFA2] hover:bg-[#2f9488] text-white'
        }`}
      >
        {paymentLoading ? 'Processing...' : `Pay ₹${totalAmount}`}
      </button>
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
          // disabled={selectedAddons.length === 0}
          className="w-full sm:w-auto py-3 px-6 rounded-lg flex items-center justify-center gap-1 shadow-lg font-bold transition-colors cursor-pointer "
          //   // selectedAddons.length === 0
          //     ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          //     : 'bg-[#37AFA2] hover:bg-[#2f9488] text-white'
          // }`}
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
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

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
                      href="/BookAppoientment"
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

            {currentStep === 2 && (
              <motion.div key="step2" /* ... */>
                <TestSelection
                  onBack={handlePrevStep}
                  onNext={() => {
                    setSelectedTests(selectedTests); // Make sure this is being set
                    handleNextStep();
                  }}
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
                <PatientDetails
                  onBack={handlePrevStep}
                  onNext={handleNextStep}
                  selectedLab={selectedLab}
                  appointmentDate={formattedDate}
                  appointmentTime={selectedTime}
                />
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div key="step4" /* ... */>
                <AddOns
                  onBack={handlePrevStep}
                  onNext={() => {
                    setSelectedAddons(selectedAddons);
                    handleNextStep();
                  }}
                  selectedLab={selectedLab}
                  appointmentDate={formattedDate}
                  appointmentTime={selectedTime}
                />
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                key="step5"
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
                <Payment
                  onBack={handlePrevStep}
                  onNext={handleNextStep}
                  selectedLab={selectedLab}
                  appointmentDate={formattedDate}
                  appointmentTime={selectedTime}
                  selectedTests={selectedTests}
                  selectedAddons={selectedAddons}
                />
              </motion.div>
            )}

            {/* Step 6 - Confirmation */}
            {/* {currentStep === 6 && (
              <motion.div
                key="step6"
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
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Booking Confirmed!
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Your lab tests have been successfully booked.
                    </p>

                    <div className="w-full max-w-md bg-gray-50 rounded-lg p-6 mb-6">
                      <h3 className="font-semibold text-lg text-gray-800 mb-4">
                        Booking Details
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Lab Name:</span>
                          <span className="font-medium">
                            {selectedLab?.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-medium">{formattedDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Time:</span>
                          <span className="font-medium">{selectedTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tests:</span>
                          <span className="font-medium text-right">
                            {selectedTests.join(', ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Link
                      href="/"
                      className="bg-[#37AFA2] hover:bg-[#2f9488] transition-colors text-white font-bold py-3 px-6 rounded-lg shadow-lg cursor-pointer"
                    >
                      Back to Home
                    </Link>
                  </div>
                </div>
              </motion.div>
            )} */}

            {currentStep === 6 && (
              <motion.div
                key="step6"
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
                               {' '}
                <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-black w-full max-w-4xl my-8">
                                   {' '}
                  <div className="flex flex-col items-center text-center">
                                       {' '}
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                           {' '}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                                               {' '}
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                                             {' '}
                      </svg>
                                         {' '}
                    </div>
                                       {' '}
                    <Image
                      src="/QR.png"
                      alt="QR Code"
                      width={150}
                      height={150}
                    />
                                       {' '}
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                            Booking Confirmed!                  
                       {' '}
                    </h2>
                                       {' '}
                    <p className="text-gray-600 mb-6">
                                            Your lab tests have been
                      successfully booked.                    {' '}
                    </p>
                                       {' '}
                    <div className="w-full max-w-md bg-gray-50 rounded-lg p-6 mb-6">
                                           {' '}
                      <h3 className="font-semibold text-lg text-gray-800 mb-4">
                                                Booking Details                
                             {' '}
                      </h3>
                                           {' '}
                      <div className="space-y-3">
                                               {' '}
                        <div className="flex justify-between">
                                                   {' '}
                          <span className="text-gray-600">Lab Name:</span>     
                                             {' '}
                          <span className="font-medium">
                                                        {selectedLab?.name}     
                                               {' '}
                          </span>
                                                 {' '}
                        </div>
                                               {' '}
                        <div className="flex justify-between">
                                                   {' '}
                          <span className="text-gray-600">Date:</span>         
                                         {' '}
                          <span className="font-medium">{formattedDate}</span> 
                                               {' '}
                        </div>
                                               {' '}
                        <div className="flex justify-between">
                                                   {' '}
                          <span className="text-gray-600">Time:</span>         
                                         {' '}
                          <span className="font-medium">{selectedTime}</span>   
                                             {' '}
                        </div>
                                               {' '}
                        <div className="flex justify-between">
                                                   {' '}
                          <span className="text-gray-600">Tests:</span>         
                                         {' '}
                          <span className="font-medium text-right">
                                                       {' '}
                            {selectedTests.join(', ')}                       
                             {' '}
                          </span>
                                                 {' '}
                        </div>
                                             {' '}
                      </div>
                                         {' '}
                    </div>
                                       {' '}
                    <Link
                      _
                      href="/"
                      className="bg-[#37AFA2] hover:bg-[#2f9488] transition-colors text-white font-bold py-3 px-6 rounded-lg shadow-lg cursor-pointer"
                    >
                                            Back to Home                  
                       {' '}
                    </Link>
                                     {' '}
                  </div>
                                 {' '}
                </div>
                             {' '}
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
