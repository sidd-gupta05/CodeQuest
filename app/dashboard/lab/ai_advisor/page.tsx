// app/dashboard/lab/ai_advisor/page.tsx
'use client';
import React from 'react';
import AsideNavbar from '@/components/Lab/AsideNavbar';

const AI_AD = () => {
  const [isNavOpen, setIsNavOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AsideNavbar
        isOpen={isNavOpen}
        onToggle={() => setIsNavOpen(!isNavOpen)}
      />
      <div className="flex-1 md:ml-64 p-8">AI Advisor</div>
    </div>
  );
};

export default AI_AD;
