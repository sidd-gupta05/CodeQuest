// 'use client';

// import { QRCodeSVG } from 'qrcode.react';
// import Link from 'next/link';
// import { useEffect, useState } from 'react';
// import BookingNavigation from './BookingNavigation';
// import { useRouter } from 'next/navigation';

// interface PatientDetails {
//   firstName: string;
//   lastName: string;
//   age: string;
//   gender: string;
//   email?: string;
//   phone?: string;
// }

// interface Lab {
//   id: number;
//   name: string;
//   [key: string]: any; // Allow additional lab properties
// }

// interface ConfirmationProps {
//   selectedLab: Lab;
//   appointmentDate: string;
//   appointmentTime: string;
//   selectedTests: string[];
//   selectedAddons: string[];
//   patientDetails: PatientDetails;
//   onBack?: () => void;
// }

// export default function Confirmation({
//   selectedLab,
//   appointmentDate,
//   appointmentTime,
//   selectedTests,
//   selectedAddons,
//   patientDetails,
//   onBack,
// }: ConfirmationProps) {
//   const [bookingId, setBookingId] = useState<string>('');
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const generateBookingId = () => {
//       try {
//         // Generate timestamp portion
//         const timestamp = Date.now().toString(36).slice(-6).toUpperCase();

//         // Generate patient initials with fallbacks
//         const firstNameInitial = patientDetails?.firstName?.charAt(0) || 'P';
//         const lastNameInitial = patientDetails?.lastName?.charAt(0) || 'X';
//         const patientInitials =
//           `${firstNameInitial}${lastNameInitial}`.toUpperCase();

//         // Generate lab code with proper padding
//         const labCode = selectedLab?.id
//           ?.toString()
//           .padStart(3, '0')
//           .slice(-3)
//           .toUpperCase();

//         // Generate test code
//         const testCode =
//           selectedTests.length > 0
//             ? selectedTests
//                 .map((t) => t.charAt(0))
//                 .join('')
//                 .slice(0, 3) // Limit to 3 characters
//                 .toUpperCase()
//             : 'GEN';

//         // Generate services hash
//         const servicesHash = [...selectedTests, ...selectedAddons]
//           .join('')
//           .split('')
//           .reduce((acc, char) => acc + char.charCodeAt(0), 0)
//           .toString(16)
//           .slice(-4)
//           .toUpperCase();

//         setBookingId(
//           `BK-${timestamp}-${patientInitials}-${labCode}-${testCode}-${servicesHash}`
//         );
//       } catch (error) {
//         console.error('Error generating booking ID:', error);
//         // Fallback ID if generation fails
//         setBookingId(`BK-${Date.now().toString(36).toUpperCase()}`);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     generateBookingId();
//   }, [selectedLab, selectedTests, selectedAddons, patientDetails]);

//   const handleTrackReport = () => {
//     // Save booking data to localStorage or context
//     const bookingData = {
//       bookingId,
//       lab: selectedLab,
//       date: appointmentDate,
//       time: appointmentTime,
//       tests: selectedTests,
//       addons: selectedAddons,
//       patient: patientDetails,
//       timestamp: new Date().toISOString(),
//     };
//     localStorage.setItem('currentBooking', JSON.stringify(bookingData));
//     router.push('/Trackreport');
//   };

//   if (isLoading) {
//     return (
//       <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-black w-full max-w-4xl my-8 flex justify-center items-center h-64">
//         <div className="animate-pulse flex flex-col items-center">
//           <div className="h-8 w-8 bg-[#37AFA2] rounded-full mb-4"></div>
//           <p className="text-gray-600">Generating your booking details...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-black w-full max-w-4xl my-8">
//       <div className="flex flex-col items-center text-center">
//         {/* QR Code Section */}
//         <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 relative">
//           <QRCodeSVG
//             value={JSON.stringify({
//               bookingId,
//               labId: selectedLab.id,
//               labName: selectedLab.name,
//               date: appointmentDate,
//               time: appointmentTime,
//               tests: selectedTests,
//               addons: selectedAddons,
//               patient: patientDetails,
//               timestamp: new Date().toISOString(),
//             })}
//             size={200}
//             level="H"
//             includeMargin={true}
//             fgColor="#37AFA2"
//             imageSettings={{
//               src: '/logo.svg',
//               height: 40,
//               width: 40,
//               excavate: true,
//             }}
//           />
//           <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded text-xs text-gray-500">
//             Scan for details
//           </div>
//         </div>

//         {/* Confirmation Header */}
//         <div className="mb-6">
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">
//             Booking Confirmed!
//           </h2>
//           <p className="text-gray-600">
//             Your lab tests have been successfully booked. A confirmation has
//             been sent to{' '}
//             <span className="font-medium">
//               {patientDetails.email || 'your email'}
//             </span>
//             .
//           </p>
//         </div>

//         {/* Booking Details Card */}
//         <div className="w-full max-w-md bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
//           <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center justify-between">
//             <span>Booking Details</span>
//             <span className="text-sm font-normal bg-[#37AFA2] text-white px-2 py-1 rounded">
//               {bookingId}
//             </span>
//           </h3>

//           <div className="space-y-4">
//             {/* Patient Info */}
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <p className="text-gray-600 text-sm">Patient Name</p>
//                 <p className="font-medium">
//                   {patientDetails.firstName} {patientDetails.lastName}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-gray-600 text-sm">Age/Gender</p>
//                 <p className="font-medium">
//                   {patientDetails.age}/{patientDetails.gender}
//                 </p>
//               </div>
//             </div>

//             {/* Lab Info */}
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <p className="text-gray-600 text-sm">Lab Name</p>
//                 <p className="font-medium">{selectedLab.name}</p>
//               </div>
//               <div>
//                 <p className="text-gray-600 text-sm">Date & Time</p>
//                 <p className="font-medium">
//                   {appointmentDate} at {appointmentTime}
//                 </p>
//               </div>
//             </div>

//             {/* Tests Section */}
//             <div>
//               <p className="text-gray-600 text-sm mb-1">Tests</p>
//               <ul className="space-y-1">
//                 {selectedTests.map((test, index) => (
//                   <li key={index} className="font-medium flex items-start">
//                     <span className="text-[#37AFA2] mr-2">•</span>
//                     {test}
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Addons Section */}
//             {selectedAddons.length > 0 && (
//               <div>
//                 <p className="text-gray-600 text-sm mb-1">Add-ons</p>
//                 <ul className="space-y-1">
//                   {selectedAddons.map((addon, index) => (
//                     <li key={index} className="font-medium flex items-start">
//                       <span className="text-[#37AFA2] mr-2">+</span>
//                       {addon}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
//           {onBack && (
//             <button
//               onClick={onBack}
//               className="bg-white hover:bg-gray-100 transition-colors text-[#37AFA2] font-bold py-3 px-6 rounded-lg border border-[#37AFA2] shadow-sm cursor-pointer flex-1"
//             >
//               Back
//             </button>
//           )}

//           <button
//             onClick={handleTrackReport}
//             className="bg-[#37AFA2] hover:bg-[#2f9488] transition-colors text-white font-bold py-3 px-6 rounded-lg shadow-lg cursor-pointer flex-1"
//           >
//             Track Your Report
//           </button>
//         </div>

//         {/* Additional Help */}
//         <div className="mt-6 text-sm text-gray-500">
//           <p>
//             Need help? Contact support at{' '}
//             <span className="text-[#37AFA2]">support@example.com</span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';
import BookingNavigation from './BookingNavigation';
import { useRouter } from 'next/navigation';

interface PatientDetails {
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  email?: string;
  phone?: string;
}

interface Lab {
  id: number;
  name: string;
  [key: string]: any;
}

interface ConfirmationProps {
  selectedLab: Lab;
  appointmentDate: string;
  appointmentTime: string;
  selectedTests: string[];
  selectedAddons: string[];
  patientDetails: PatientDetails;
  onBack?: () => void;
}

export default function Confirmation({
  selectedLab,
  appointmentDate,
  appointmentTime,
  selectedTests,
  selectedAddons,
  patientDetails,
  onBack,
}: ConfirmationProps) {
  const [bookingId, setBookingId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const generateBookingId = () => {
      try {
        const timestamp = Date.now().toString(36).slice(-6).toUpperCase();
        const firstNameInitial = patientDetails?.firstName?.charAt(0) || 'P';
        const lastNameInitial = patientDetails?.lastName?.charAt(0) || 'X';
        const patientInitials =
          `${firstNameInitial}${lastNameInitial}`.toUpperCase();
        const labCode = selectedLab?.id
          ?.toString()
          .padStart(3, '0')
          .slice(-3)
          .toUpperCase();
        const testCode =
          selectedTests.length > 0
            ? selectedTests
                .map((t) => t.charAt(0))
                .join('')
                .slice(0, 3)
                .toUpperCase()
            : 'GEN';

        const servicesHash = [...selectedTests, ...selectedAddons]
          .join('')
          .split('')
          .reduce((acc, char) => acc + char.charCodeAt(0), 0)
          .toString(16)
          .slice(-4)
          .toUpperCase();

        const newBookingId = `BK-${timestamp}-${patientInitials}-${labCode}-${testCode}-${servicesHash}`;
        setBookingId(newBookingId);
      } catch (error) {
        console.error('Error generating booking ID:', error);
        setBookingId(`BK-${Date.now().toString(36).toUpperCase()}`);
      } finally {
        setIsLoading(false);
      }
    };

    generateBookingId();
  }, [selectedLab, selectedTests, selectedAddons, patientDetails]);

  useEffect(() => {
    const sendConfirmationEmail = async () => {
      if (!bookingId || emailSent) return;

      try {
        const response = await fetch('/api/send-confirmation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookingDetails: {
              bookingId,
              lab: selectedLab,
              date: appointmentDate,
              time: appointmentTime,
              tests: selectedTests,
              addons: selectedAddons,
              patient: patientDetails,
            },
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to send confirmation email');
        }

        setEmailSent(true);
      } catch (error) {
        console.error('Error sending confirmation email:', error);
        setEmailError(
          'Failed to send confirmation email. Please contact support.'
        );
      }
    };

    sendConfirmationEmail();
  }, [bookingId, emailSent]);

  const handleTrackReport = () => {
    const bookingData = {
      bookingId,
      lab: selectedLab,
      date: appointmentDate,
      time: appointmentTime,
      tests: selectedTests,
      addons: selectedAddons,
      patient: patientDetails,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('currentBooking', JSON.stringify(bookingData));
    router.push('/Trackreport');
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-black w-full max-w-4xl my-8 flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 bg-[#37AFA2] rounded-full mb-4"></div>
          <p className="text-gray-600">Generating your booking details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-black w-full max-w-4xl my-8">
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 relative">
          <QRCodeSVG
            value={JSON.stringify({
              bookingId,
              labId: selectedLab.id,
              labName: selectedLab.name,
              date: appointmentDate,
              time: appointmentTime,
              tests: selectedTests,
              addons: selectedAddons,
              patient: patientDetails,
              timestamp: new Date().toISOString(),
            })}
            size={200}
            level="H"
            includeMargin={true}
            fgColor="#37AFA2"
            imageSettings={{
              src: '/logo.svg',
              height: 40,
              width: 40,
              excavate: true,
            }}
          />
          <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded text-xs text-gray-500">
            Scan for details
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Booking Confirmed!
        </h2>
        <p className="text-gray-600 mb-6">
          {emailSent ? (
            <>
              A test confirmation has been sent to
              siddharthgupta2482005@gmail.com.
              <br />
            </>
          ) : emailError ? (
            <span className="text-red-500">{emailError}</span>
          ) : (
            'Sending test confirmation email...'
          )}
        </p>
        <div className="w-full max-w-md bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
          <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center justify-between">
            <span>Booking Details</span>
            <span className="text-sm font-normal bg-[#37AFA2] text-white px-2 py-1 rounded">
              {bookingId}
            </span>
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Patient Name</p>
                <p className="font-medium">
                  {patientDetails.firstName} {patientDetails.lastName}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Age/Gender</p>
                <p className="font-medium">
                  {patientDetails.age}/{patientDetails.gender}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Lab Name</p>
                <p className="font-medium">{selectedLab.name}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Date & Time</p>
                <p className="font-medium">
                  {appointmentDate} at {appointmentTime}
                </p>
              </div>
            </div>

            <div>
              <p className="text-gray-600 text-sm mb-1">Tests</p>
              <ul className="space-y-1">
                {selectedTests.map((test, index) => (
                  <li key={index} className="font-medium flex items-start">
                    <span className="text-[#37AFA2] mr-2">•</span>
                    {test}
                  </li>
                ))}
              </ul>
            </div>

            {selectedAddons.length > 0 && (
              <div>
                <p className="text-gray-600 text-sm mb-1">Add-ons</p>
                <ul className="space-y-1">
                  {selectedAddons.map((addon, index) => (
                    <li key={index} className="font-medium flex items-start">
                      <span className="text-[#37AFA2] mr-2">+</span>
                      {addon}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          {onBack && (
            <button
              onClick={onBack}
              className="bg-white hover:bg-gray-100 transition-colors text-[#37AFA2] font-bold py-3 px-6 rounded-lg border border-[#37AFA2] shadow-sm cursor-pointer flex-1"
            >
              Back
            </button>
          )}

          <button
            onClick={handleTrackReport}
            className="bg-[#37AFA2] hover:bg-[#2f9488] transition-colors text-white font-bold py-3 px-6 rounded-lg shadow-lg cursor-pointer flex-1"
          >
            Track Your Report
          </button>
        </div>
        <div className="mt-6 text-sm text-gray-500">
          <p>
            Need help? Contact support at{' '}
            <span className="text-[#37AFA2]">support@example.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}
