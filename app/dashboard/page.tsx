// app/dashboard/page.tsx
'use client';

import { useContext, useState } from 'react';
import AsideNavbar from '@/components/Lab/AsideNavbar';
import { LabContext } from '../context/LabContext';
import BookingChart from '@/components/Lab/BookingChart';
import PaginatedBookingList from '@/components/Lab/PaginatedBookingList';

export default function DashboardPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const contextData = useContext(LabContext);
  const bookingData = contextData?.bookingData || [];
  const userData = contextData?.userData || {};

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleDateSelect = (date: Date | null) => {
    setSelectedDate(date);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      <AsideNavbar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <div className="flex-1 md:ml-64 p-4 md:p-8">
        <h2 className="text-xl font-semibold">Hey, {userData.firstName} 👋</h2>

        <div>
          <div className="my-6">
            <BookingChart
              bookings={bookingData}
              onDateSelect={handleDateSelect}
            />
          </div>
          <div className="mt-6">
            <PaginatedBookingList
              bookings={bookingData}
              selectedDate={selectedDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
