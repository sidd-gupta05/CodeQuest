// app/dashboard/lab/patient_list/page.tsx
'use client';
import React, { useContext } from 'react';
import { LabContext } from '@/app/context/LabContext';
import PaginatedBookingList from '@/components/Lab/PaginatedBookingList';

const Patient_list = () => {
  const contextData = useContext(LabContext);
  const bookingData = contextData?.bookingData || [];

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold">Patient List</h2>
      <div className="my-6">
        <PaginatedBookingList bookings={bookingData} selectedDate={null} />
      </div>
    </div>
  );
};

export default Patient_list;
