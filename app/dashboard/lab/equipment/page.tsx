// app/dashboard/lab/equipment/page.tsx
'use client';
import React from 'react';
import AsideNavbar from '@/components/Lab/AsideNavbar';

const Equipment = () => {
  const [isNavOpen, setIsNavOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AsideNavbar
        isOpen={isNavOpen}
        onToggle={() => setIsNavOpen(!isNavOpen)}
      />
      <div className="flex-1 md:ml-64 p-8">Equipment</div>
    </div>
  );
};

export default Equipment;
