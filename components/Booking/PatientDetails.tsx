//components/Booking/PatientDetails.tsx
'use client';

import { useState } from 'react';
import BookingHeader from './BookingHeader';
import BookingNavigation from './BookingNavigation';

interface PatientDetailsProps {
  onBack: () => void;
  onNext: () => void;
  selectedLab: any;
  appointmentDate: string;
  appointmentTime: string;
  onPatientDetailsChange: (details: any) => void;
}

export default function PatientDetails({
  onBack,
  onNext,
  selectedLab,
  appointmentDate,
  appointmentTime,
  onPatientDetailsChange,
}: PatientDetailsProps) {
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
    onPatientDetailsChange({ ...patientData, [name]: value });
  };

  const isFormValid =
    patientData.firstName &&
    patientData.lastName &&
    patientData.gender &&
    patientData.age &&
    patientData.address;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-black w-full max-w-4xl my-8">
      <BookingHeader
        selectedLab={selectedLab}
        appointmentDate={appointmentDate}
        appointmentTime={appointmentTime}
      />

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

      <BookingNavigation
        onBack={onBack}
        onNext={onNext}
        nextDisabled={!isFormValid}
        backText="Back"
        nextText="Continue to Add Ons"
      />
    </div>
  );
}
