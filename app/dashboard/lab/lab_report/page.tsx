// app/lab-report/page.tsx
'use client';

import { useContext } from 'react';
import { LabContext } from '@/app/context/LabContext';
import { ReportProvider } from '@/app/context/ReportContext';
import LabReport from '@/components/Lab/LabReport';

const LabReportPage = () => {
  const labContext = useContext(LabContext);

  if (labContext?.loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lab data...</p>
        </div>
      </div>
    );
  }

  if (labContext?.error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center text-red-500">
          <p className="text-xl mb-2">Error Loading Data</p>
          <p>{labContext.error}</p>
        </div>
      </div>
    );
  }

  // For demo purposes, using the first patient and booking
  const firstPatient = labContext?.patients[0];
  const firstBooking = firstPatient?.bookings?.[0];

  if (!firstPatient || !firstBooking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 text-xl mb-4">
            No patient data available
          </p>
          <p className="text-gray-500">
            Please ensure you have patients with bookings in your system.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ReportProvider>
      <LabReport patientId={firstPatient.id} bookingId={firstBooking.id} />
    </ReportProvider>
  );
};

export default LabReportPage;
