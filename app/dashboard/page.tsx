// app/dashboard/page.tsx
'use client';

import { useContext, useState } from 'react';
import AsideNavbar from '@/components/Lab/AsideNavbar';
import { LabContext } from '../context/LabContext';
import { Book } from 'lucide-react';
import Booking from '../(patient)/Booking/page';
import BookingList from '@/components/Lab/BookingList';
import BookingChart from '@/components/Lab/BookingChart';

export default function DashboardPage() {

  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const contextData = useContext(LabContext);
  const bookingData = contextData?.bookingData || [];
  const userData = contextData?.userData || {};

  // console.log("Booking Data from Context:", bookingData);
  // console.log("User Data from Context:", userData);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      <AsideNavbar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <div className="flex-1 md:ml-64 p-8">
        <h2 className='text-xl font-semibold'>Hey, {userData.firstName} 👋</h2>

        <div>
          <div className='my-6'>
            <BookingChart bookings={bookingData} />
          </div>
          <div>
            <BookingList bookings={bookingData} />
          </div>
        </div>

      </div>
    </div>
  );
}
