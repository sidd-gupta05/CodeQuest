// app/dashboard/lab/calendar/page.tsx
'use client';
import React from 'react';
import AsideNavbar from '@/components/Lab/AsideNavbar';

const Calendar = () => {
  const [isNavOpen, setIsNavOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AsideNavbar
        isOpen={isNavOpen}
        onToggle={() => setIsNavOpen(!isNavOpen)}
      />
      <div className="flex-1 md:ml-64 p-8">Calendar</div>
    </div>
  );
};

export default Calendar;
