// app/dashboard/lab/employee/page.tsx
'use client';
import React, { useState, useEffect } from 'react';

const Employee = () => {
  const [pageLoading, setPageLoading] = useState(true);

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
            src="/assign.gif" 
            alt="Loading..." 
            className="mx-auto w-32 h-32"
          />
          <p className="mt-4 text-gray-600">Loading employee...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Employee</h1>
      <div className="mt-4">
        <p>Employee content will go here...</p>
      </div>
    </div>
  );
};

export default Employee;