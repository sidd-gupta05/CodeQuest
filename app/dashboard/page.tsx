'use client';

import { use, useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { supabase } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';

import { Button } from '@/components/ui/button';

export default function DashboardPage() {

  useEffect (() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, []);

  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
    });
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside
        className={`
          bg-gray-800 text-white w-full md:w-64 p-4 
          md:block ${isSidebarOpen ? 'block' : 'hidden'}
        `}
      >
        <h2 className="text-xl font-semibold mb-6">Navigation</h2>
        <ul className="space-y-4">
          <li>
            <a href="#" className="hover:text-teal-400">
              Dashboard
            </a>
          </li>
          <li>
            <a href={"/dashboard"+(user?.user_metadata['role'] === 'LAB' ? '/lab/profile' : '/profile')} className="hover:text-teal-400">
              Profile
            </a>
          </li>
          { user?.role === 'PATIENT' &&

          <li>
            <a href={('/BookAppoientment')} className="hover:text-teal-400">
              Book Appointment
            </a>
          </li>
          }
          <li>
            <a href="#" className="hover:text-teal-400">
              Settings
            </a>
          </li>
          <li>
              <button onClick={handleLogout}>
                Logout
              </button>
          </li>
        </ul>
      </aside>

      {/* Sidebar Toggle Button (for mobile) */}
      <div className="md:hidden bg-gray-100 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <Button onClick={() => setSidebarOpen(!isSidebarOpen)}>
          <Menu className="h-6 w-6 text-gray-800" />
        </Button>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="text-gray-700">
          Welcome to your dashboard! You can manage your profile, settings, and
          more here.
        </p>
        <p>Your role is {user?.user_metadata['role'] || 'User'}</p>
      </main>
    </div>
  );
}
