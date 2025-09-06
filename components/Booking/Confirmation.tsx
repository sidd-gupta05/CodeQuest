'use client';

import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

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
  authUser: any;
  onBack?: () => void;
}

export default function Confirmation({
  selectedLab,
  appointmentDate,
  appointmentTime,
  selectedTests,
  selectedAddons,
  patientDetails,
  authUser,
  onBack,
}: ConfirmationProps) {
  const [bookingId, setBookingId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [qrData, setQrData] = useState<string>('');
  const [bookingExists, setBookingExists] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get bookingId from URL parameters
    const urlBookingId = searchParams.get('bookingId');
    if (urlBookingId) {
      setBookingId(urlBookingId);
      setBookingExists(true); // Real booking ID from successful payment
    } else {
      // Generate a mock booking ID for demonstration only
      const mockBookingId = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setBookingId(mockBookingId);
      setBookingExists(false); // Mock booking ID, doesn't exist in DB
    }
  }, [searchParams]);

  useEffect(() => {
    const confirmBooking = async () => {
      if (!bookingId) return; // Wait until bookingId is set

      try {
        // Generate QR code data
        const qrDataString = JSON.stringify({
          bookingId: bookingId,
          labId: selectedLab.id,
          labName: selectedLab.name,
          date: appointmentDate,
          time: appointmentTime,
          tests: selectedTests,
          addons: selectedAddons,
          patient: patientDetails,
          timestamp: new Date().toISOString(),
        });
        setQrData(qrDataString);

        // Only update booking with QR code data if it exists in the database
        if (bookingExists) {
          const response = await fetch('/api/bookings/update-booking', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              bookingId: bookingId,
              qrCodeData: qrDataString,
            }),
          });

          if (response.ok) {
            const result = await response.json();
            if (!result.success) {
              console.error('Failed to update booking with QR code');
            }
          } else {
            console.error('Failed to update booking - server error');
          }
        } else {
          console.log('Using mock booking ID, skipping database update');
        }
      } catch (error: any) {
        console.error('Error during booking confirmation:', error);
      } finally {
        setIsLoading(false);
      }
    };

    confirmBooking();
  }, [
    bookingId,
    bookingExists,
    selectedLab,
    selectedTests,
    selectedAddons,
    patientDetails,
    appointmentDate,
    appointmentTime,
  ]);

  const handleTrackReport = () => {
    if (bookingId) {
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
    }
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
        {bookingId && qrData && (
          <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 relative">
            <QRCodeSVG
              value={qrData}
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
        )}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {bookingExists ? 'Booking Confirmed!' : 'Booking Preview'}
        </h2>
        <p className="text-gray-600 mb-6">
          {bookingExists
            ? 'Your booking has been successfully confirmed.'
            : 'This is a preview of your booking. Complete payment to confirm.'}
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
            className="bg-[#37AFA2] hover:bg-[#2f9488] transition-colors text-white font-bold py-3 px-6 rounded-lg shadow-lg cursor-pointer flex-1 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Track Your Report
          </button>
        </div>
        <div className="mt-6 text-sm text-gray-500">
          <p>
            Need help? Contact support at{' '}
            <span className="text-[#37AFA2]">LabSphere.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}
