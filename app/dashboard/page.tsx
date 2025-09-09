// app/dashboard/page.tsx
'use client';

import { useState } from 'react';
import AsideNavbar from '@/components/Lab/AsideNavbar';

export default function DashboardPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      <AsideNavbar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
    </div>
  );
}
