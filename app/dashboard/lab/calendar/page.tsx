// app/dashboard/lab/calendar/page.tsx
'use client';
import React, { useState, useEffect } from 'react';

const Calendar = () => {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (pageLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <img
            src="/calendar.gif"
            alt="Loading..."
            className="mx-auto w-32 h-32"
          />
          <p className="mt-4 text-gray-600">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Calendar</h1>
      <div className="mt-4">
        <p>Calendar content will go here...</p>
      </div>
    </div>
  );
};

export default Calendar;
