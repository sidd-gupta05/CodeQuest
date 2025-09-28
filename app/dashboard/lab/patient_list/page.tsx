// app/dashboard/lab/patient_list/page.tsx
'use client';
import React, { useContext, useState, useEffect } from 'react';
import { LabContext } from '@/app/context/LabContext';
import PatientList from '@/components/Lab/PatientList';

const Patient_list = () => {
  const contextData = useContext(LabContext);
  const patientData = contextData?.patients || [];
  const [pageLoading, setPageLoading] = useState(true);

  console.log('Patient Data:', patientData);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (pageLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <img
            src="/to-do-list.gif"
            alt="Loading..."
            className="mx-auto w-32 h-32"
          />
          <p className="mt-4 text-gray-600">Loading patient list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold">Patient List</h2>
      <div className="my-6">
        <PatientList patients={patientData} />
      </div>
    </div>
  );
};

export default Patient_list;
