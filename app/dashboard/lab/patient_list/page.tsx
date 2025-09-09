// app/dashboard/lab/patient_list/page.tsx
"use client";
import React, { use, useContext, useEffect } from 'react';
import AsideNavbar from '@/components/Lab/AsideNavbar';
import { LabContext } from '@/app/context/LabContext';
import BookingList from '@/components/Lab/BookingList';

const Patient_list = () => {

  const contextData = useContext(LabContext);
  const bookingData = contextData?.bookingData || [];

  const [isNavOpen, setIsNavOpen] = React.useState(false);

  return (

    <div className="flex min-h-screen bg-gray-50">
      <AsideNavbar
        isOpen={isNavOpen}
        onToggle={() => setIsNavOpen(!isNavOpen)}
      />

      <div className="flex-1 md:ml-64 p-8">

        <h2 className='text-xl font-semibold'>Patient List</h2>

        <div className='my-6'>
          <BookingList bookings={bookingData} />
        </div>

      </div>

    </div>
  );
};

export default Patient_list;
