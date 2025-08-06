'use client';

import { QRCodeSVG } from 'qrcode.react';
import Link from 'next/link';

interface ConfirmationProps {
  selectedLab: any;
  appointmentDate: string;
  appointmentTime: string;
  selectedTests: string[];
  selectedAddons: string[];
  patientDetails: any;
}

export default function Confirmation({
  selectedLab,
  appointmentDate,
  appointmentTime,
  selectedTests,
  selectedAddons,
  patientDetails,
}: ConfirmationProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-black w-full max-w-4xl my-8">
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
          <QRCodeSVG
            value={JSON.stringify({
              labId: selectedLab.id,
              labName: selectedLab.name,
              date: appointmentDate,
              time: appointmentTime,
              tests: selectedTests,
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
              <span className="text-gray-600">Patient Name:</span>
              <span className="font-medium">
                {patientDetails.firstName} {patientDetails.lastName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Age/Gender:</span>
              <span className="font-medium">
                {patientDetails.age}/{patientDetails.gender}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Lab Name:</span>
              <span className="font-medium">{selectedLab.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{appointmentDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time:</span>
              <span className="font-medium">{appointmentTime}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-600 mb-1">Tests:</span>
              <ul className="list-disc list-inside text-left">
                {selectedTests.map((test, index) => (
                  <li key={index} className="font-medium">
                    {test}
                  </li>
                ))}
              </ul>
            </div>
            {selectedAddons.length > 0 && (
              <div className="flex flex-col">
                <span className="text-gray-600 mb-1">Add-ons:</span>
                <ul className="list-disc list-inside text-left">
                  {selectedAddons.map((addon, index) => (
                    <li key={index} className="font-medium">
                      {addon}
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
  );
}
