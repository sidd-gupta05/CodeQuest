//app/dashboard/layout.js
'use client';

import { useState } from 'react';
import { LabProvider } from '../context/LabContext';
import AsideNavbar from '@/components/Lab/AsideNavbar';

const DashboardLayout = ({ children }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <LabProvider>
        <AsideNavbar
          isOpen={isNavOpen}
          onToggle={() => setIsNavOpen(!isNavOpen)}
        />
        <main className="flex-1 md:ml-64">{children}</main>
      </LabProvider>
    </div>
  );
};

export default DashboardLayout;
