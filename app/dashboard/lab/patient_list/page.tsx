// app/dashboard/lab/patient_list/page.tsx
'use client';
import React, { useContext, useState } from 'react';
import AsideNavbar from '@/components/Lab/AsideNavbar';
import { LabContext } from '@/app/context/LabContext';
import PaginatedBookingList from '@/components/Lab/PaginatedBookingList';

const Patient_list = () => {
  const contextData = useContext(LabContext);
  const bookingData = contextData?.bookingData || [];
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AsideNavbar
        isOpen={isNavOpen}
        onToggle={() => setIsNavOpen(!isNavOpen)}
      />

      <div className="flex-1 md:ml-64 p-8">
        <h2 className="text-xl font-semibold">Patient List</h2>

        <div className="my-6">
          <PaginatedBookingList bookings={bookingData} selectedDate={null} />
        </div>
      </div>
    </div>
  );
};

export default Patient_list;
