// app/dashboard/lab/patient_list/page.tsx
'use client';
import React, { useContext, useState, useEffect } from 'react';
import { LabContext } from '@/app/context/LabContext';
import PatientList from '@/components/Lab/PatientList';

const Patient_list = () => {
  const contextData = useContext(LabContext);
  const patientData = contextData?.patients || [];

  console.log('Patient Data:', patientData);

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
