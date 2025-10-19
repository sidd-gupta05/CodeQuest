// //components/Booking/PatientDetails.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import BookingHeader from './BookingHeader';
// import BookingNavigation from './BookingNavigation';
// // import { email } from 'zod';

// interface PatientDetailsProps {
//   onBack: () => void;
//   onNext: () => void;
//   selectedLab: any;
//   appointmentDate: string;
//   appointmentTime: string;
//   patientDetails: any;
//   onPatientDetailsChange: (details: any) => void;
// }

// export default function PatientDetails({
//   onBack,
//   onNext,
//   selectedLab,
//   appointmentDate,
//   appointmentTime,
//   patientDetails,
//   onPatientDetailsChange,
// }: PatientDetailsProps) {
//   const [patientData, setPatientData] = useState({
//     firstName: '',
//     lastName: '',
//     gender: '',
//     age: '',
//     address: '',
//     phone: '',
//   });

//   useEffect(() => {
//     if (patientDetails) {
//       setPatientData({
//         firstName: patientDetails.firstName || '',
//         lastName: patientDetails.lastName || '',
//         gender: patientDetails.gender || '',
//         age: patientDetails.age || '',
//         address: patientDetails.address || '',
//         phone: patientDetails.phone || '',
//       });
//     }
//   }, [patientDetails]);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     const updatedData = {
//       ...patientData,
//       [name]: value,
//     };
//     setPatientData(updatedData);
//     onPatientDetailsChange(updatedData);
//   };

//   console.log('Patient Data:', patientData);
//   // console.log('Patient Details Prop:', patientDetails);

//   const isFormValid =
//     patientData.firstName &&
//     patientData.lastName &&
//     patientData.gender &&
//     patientData.age &&
//     patientData.phone &&
//     patientData.address;

//   return (
//     <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-black w-full max-w-4xl my-8">
//       <BookingHeader
//         selectedLab={selectedLab}
//         appointmentDate={appointmentDate}
//         appointmentTime={appointmentTime}
//       />

//       <div className="border-b border-gray-200 my-6"></div>

//       <h3 className="font-bold text-gray-800 text-lg mb-6">Patient Details</h3>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <label
//             htmlFor="firstName"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             First Name*
//           </label>
//           <input
//             type="text"
//             id="firstName"
//             name="firstName"
//             value={patientData.firstName}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37AFA2]"
//             required
//           />
//         </div>

//         <div>
//           <label
//             htmlFor="lastName"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Last Name*
//           </label>
//           <input
//             type="text"
//             id="lastName"
//             name="lastName"
//             value={patientData.lastName}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37AFA2]"
//             required
//           />
//         </div>

//         <div>
//           <label
//             htmlFor="phone"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Phone*
//           </label>
//           <input
//             type="phone"
//             id="phone"
//             name="phone"
//             value={patientData.phone}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37AFA2]"
//             required
//           />
//         </div>

//         <div>
//           <label
//             htmlFor="gender"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Gender*
//           </label>
//           <select
//             id="gender"
//             name="gender"
//             value={patientData.gender}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37AFA2]"
//             required
//           >
//             <option value="">Select Gender</option>
//             <option value="male">Male</option>
//             <option value="female">Female</option>
//             <option value="other">Other</option>
//             <option value="prefer-not-to-say">Prefer not to say</option>
//           </select>
//         </div>

//         <div>
//           <label
//             htmlFor="age"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Age*
//           </label>
//           <input
//             type="number"
//             id="age"
//             name="age"
//             min="0"
//             max="120"
//             value={patientData.age}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37AFA2]"
//             required
//           />
//         </div>

//         <div className="md:col-span-2">
//           <label
//             htmlFor="address"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Address*
//           </label>
//           <input
//             type="text"
//             id="address"
//             name="address"
//             value={patientData.address}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37AFA2]"
//             required
//           />
//         </div>
//       </div>

//       <BookingNavigation
//         onBack={onBack}
//         onNext={onNext}
//         nextDisabled={!isFormValid}
//         backText="Back"
//         nextText="Continue to Add Ons"
//       />
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import BookingHeader from './BookingHeader';
import BookingNavigation from './BookingNavigation';
import { supabase } from '@/utils/supabase/client';
import { Circle, Loader, Loader2, Phone, User } from 'lucide-react';
// import { id } from 'date-fns/locale';

interface PatientDetailsProps {
  onBack: () => void;
  onNext: () => void;
  selectedLab: any;
  appointmentDate: string;
  appointmentTime: string;
  patientDetails: any;
  onPatientDetailsChange: (details: any) => void;
}

export default function PatientDetails({
  onBack,
  onNext,
  selectedLab,
  appointmentDate,
  appointmentTime,
  patientDetails,
  onPatientDetailsChange,
}: PatientDetailsProps) {
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );
  const [showNewForm, setShowNewForm] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [patientData, setPatientData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    dob: '',
    age: '',
    address: '',
    phone: '',
  });

  // Fetch user + patients
  useEffect(() => {
    async function fetchUserAndPatients() {
      setIsLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from('users')
        .select(
          `
          id,
          patient:patients (
            id,
            firstName,
            lastName,
            age,
            gender,
            dateOfBirth,
            phone,
            address
          )
        `
        )
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching patients:', error.message);
        setIsLoading(false);
      } else if (data) {
        setPatients(data.patient || []);
        console.log('Fetched Patients:', data.patient);
        setIsLoading(false);
        if (data.patient.length === 0) {
          setShowNewForm(true);
          setIsLoading(false);
        }
      }
    }

    fetchUserAndPatients();
  }, []);

  // If user selects existing patient
  useEffect(() => {
    if (selectedPatientId) {
      const existing = patients.find((p) => p.id === selectedPatientId);
      if (existing) {
        onPatientDetailsChange({
          id: existing.id,
          firstName: existing.firstName || '',
          lastName: existing.lastName || '',
          gender: existing.gender || '',
          dob: existing.dateOfBirth || '',
          age: existing.age || '',
          address: existing.address || '',
          phone: existing.phone || '',
        });
        setPatientData({
          firstName: existing.firstName || '',
          lastName: existing.lastName || '',
          gender: existing.gender || '',
          dob: existing.dateOfBirth || '',
          age: existing.age || '',
          address: existing.address || '',
          phone: existing.phone || '',
        });
      }
    }
  }, [selectedPatientId]);

  // Handle new patient form change
  // const handleChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  // ) => {
  //   const { name, value } = e.target;
  //   const updatedData = {
  //     ...patientData,
  //     [name]: value,
  //   };
  //   setPatientData(updatedData);
  //   onPatientDetailsChange(updatedData);
  // };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    const updatedData = { ...patientData, [name]: value };

    // If DOB changes, calculate age
    if (name === 'dob' && value) {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      updatedData.age = age.toString();
    }

    setPatientData(updatedData);
    onPatientDetailsChange(updatedData);
  };

  const isFormValid =
    patientData.firstName &&
    patientData.lastName &&
    patientData.gender &&
    patientData.age &&
    patientData.phone &&
    patientData.address;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#37AFA2]" size={32} />
        <span className="text-slate-700 text-sm mt-1">
          Loading patient details . . .
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-black w-full max-w-4xl my-8">
      <BookingHeader
        selectedLab={selectedLab}
        appointmentDate={appointmentDate}
        appointmentTime={appointmentTime}
      />

      <div className="border-b border-gray-200 my-6"></div>

      <h3 className="font-bold text-gray-800 text-lg mb-6">Patient Details</h3>

      {/* Existing Patients List */}
      {patients.length > 0 && !showNewForm && (
        <div className="mb-6">
          <h4 className="font-semibold mb-3">Select Existing Patient</h4>
          <div className="space-y-3">
            {patients.map((p) => (
              <label
                key={p.id}
                className="flex items-center gap-3 border rounded-lg p-3 cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="radio"
                  name="patient"
                  value={p.id}
                  checked={selectedPatientId === p.id}
                  onChange={() => setSelectedPatientId(p.id)}
                />

                <div>
                  <p className="font-medium">
                    {p.firstName} {p.lastName}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {/* Age Badge */}
                    <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {/* <User className="w-3 h-3" /> */}
                      {p.age} yrs
                    </span>

                    {/* Gender Badge */}
                    <span className="flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {/* <Circle className="w-3 h-3" /> */}
                      {p.gender}
                    </span>

                    {/* Phone Badge */}
                    <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      <Phone className="w-3 h-3" />
                      {p.phone}
                    </span>
                  </div>
                </div>
              </label>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setShowNewForm(true);
              setSelectedPatientId(null); // unselect any existing patient
              setPatientData({
                // reset form fields
                firstName: '',
                lastName: '',
                gender: '',
                dob: '',
                age: '',
                address: '',
                phone: '',
              });
              onPatientDetailsChange({}); // notify parent that no patient is selected
            }}
            className="mt-4 text-sm text-[#37AFA2] underline"
          >
            + Add New Patient
          </button>
        </div>
      )}

      {/* New Patient Form */}
      {showNewForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name*
            </label>
            <input
              type="text"
              name="firstName"
              value={patientData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#37AFA2]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name*
            </label>
            <input
              type="text"
              name="lastName"
              value={patientData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#37AFA2]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone*
            </label>
            <input
              type="text"
              name="phone"
              value={patientData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#37AFA2]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender*
            </label>
            <select
              name="gender"
              value={patientData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#37AFA2]"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth*
            </label>
            <input
              type="date"
              name="dob"
              value={patientData.dob}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#37AFA2]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age*
            </label>
            <input
              type="number"
              name="age"
              value={patientData.age}
              onChange={handleChange}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#37AFA2]"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address*
            </label>
            <input
              type="text"
              name="address"
              value={patientData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#37AFA2]"
              required
            />
          </div>

          {patients.length > 0 && (
            <button
              type="button"
              onClick={() => setShowNewForm(false)}
              className="text-sm ml-0 flex items-start text-gray-500 underline mt-2"
            >
              Back to Existing Patients
            </button>
          )}
        </div>
      )}

      <BookingNavigation
        onBack={onBack}
        onNext={onNext}
        nextDisabled={
          !selectedPatientId && !isFormValid // disable next if neither selected nor filled form
        }
        backText="Back"
        nextText="Continue to Add Ons"
      />
    </div>
  );
}
