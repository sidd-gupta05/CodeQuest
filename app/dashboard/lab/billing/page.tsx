// app/dashboard/lab/billing/page.tsx
'use client';
import React from 'react';
import AsideNavbar from '@/components/Lab/AsideNavbar';

const Billing = () => {
  const [isNavOpen, setIsNavOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AsideNavbar
        isOpen={isNavOpen}
        onToggle={() => setIsNavOpen(!isNavOpen)}
      />
      <div className="flex-1 md:ml-64 p-8">Billing</div>
    </div>
  );
};

export default Billing;
