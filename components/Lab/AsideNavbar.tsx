'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Menu,
  X,
  LayoutGrid,
  Users,
  Calendar,
  UserCog,
  Warehouse,
  BarChart3,
  CreditCard,
  Wrench,
  Settings,
  LogOut,
  ChevronDown,
  Flame,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import { supabase } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';
import Link from 'next/link';

interface AsideNavbarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const AsideNavbar = ({ isOpen, onToggle }: AsideNavbarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
        setRole(profile?.role);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
    });
    router.push('/');
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    if (window.innerWidth < 768) {
      onToggle();
    }
  };

  return (
    <>
      {/* Mobile Header with Logo and Toggle Button on Right - Only for mobile */}
      <div className="md:hidden bg-gray-50 p-4 flex justify-between items-center shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <a href="/" className="block">
            <img
              src="/logo3.svg"
              alt="Labsphere Logo"
              width={100}
              height={100}
              className="cursor-pointer"
            />
          </a>
        </div>
        <button
          onClick={onToggle}
          className="p-2 rounded-md hover:bg-gray-200 transition-colors"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <ChevronRight className="h-6 w-6" />
          )}
        </button>
      </div>

      <aside
        className={`
          bg-white text-black w-64 p-4 fixed h-full
          transition-transform duration-300 ease-in-out z-40
          md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo for desktop - No close button since we don't have toggle on desktop */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3 px-2">
              <a href="/" className="block">
                <img
                  src="/logo3.svg"
                  alt="Labsphere Logo"
                  width={150}
                  height={150}
                />
              </a>
            </div>
            {/* Close button only for mobile inside sidebar */}
            <button
              onClick={onToggle}
              className="md:hidden p-2 rounded-md hover:bg-gray-100"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          <nav className="flex-1">
            <ul className="space-y-1">
              <li>
                <Link
                  href="/dashboard"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('/dashboard');
                  }}
                  className={`flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    pathname === '/dashboard'
                      ? 'bg-[#e0f5f5] text-[#006A6A]'
                      : 'text-black hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <LayoutGrid className="h-5 w-5" />
                    <span>Dashboard</span>
                  </div>
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard/lab/patient_list"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('/dashboard/lab/patient_list');
                  }}
                  className={`flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    pathname === '/dashboard/lab/patient_list'
                      ? 'bg-[#e0f5f5] text-[#006A6A]'
                      : 'text-black hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5" />
                    <span>Patients List</span>
                  </div>
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard/lab/calendar"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('/dashboard/lab/calendar');
                  }}
                  className={`flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    pathname === '/dashboard/lab/calendar'
                      ? 'bg-[#e0f5f5] text-[#006A6A]'
                      : 'text-black hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5" />
                    <span>Calendar</span>
                  </div>
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard/lab/employee"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('/dashboard/lab/employee');
                  }}
                  className={`flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    pathname === '/dashboard/lab/employee'
                      ? 'bg-[#e0f5f5] text-[#006A6A]'
                      : 'text-black hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <UserCog className="h-5 w-5" />
                    <span>Employee</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard/lab/inventory"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('/dashboard/lab/inventory');
                  }}
                  className={`flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    pathname === '/dashboard/lab/inventory'
                      ? 'bg-[#e0f5f5] text-[#006A6A]'
                      : 'text-black hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Warehouse className="h-5 w-5" />
                    <span>Inventory</span>
                  </div>
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard/lab/ai_advisor"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('/dashboard/lab/ai_advisor');
                  }}
                  className={`flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    pathname === '/dashboard/lab/ai_advisor'
                      ? 'bg-[#e0f5f5] text-[#006A6A]'
                      : 'text-black hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5" />
                    <span>AI Ad Advisor</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs bg-gray-200 text-black py-0.5 px-2 rounded-full">
                    Hot
                    <Flame className="h-3 w-3 text-orange-400" />
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard/lab/billing"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('/dashboard/lab/billing');
                  }}
                  className={`flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    pathname === '/dashboard/lab/billing'
                      ? 'bg-[#e0f5f5] text-[#006A6A]'
                      : 'text-black hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5" />
                    <span>Billing</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard/lab/equipment"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('/dashboard/lab/equipment');
                  }}
                  className={`flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    pathname === '/dashboard/lab/equipment'
                      ? 'bg-[#e0f5f5] text-[#006A6A]'
                      : 'text-black hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Wrench className="h-5 w-5" />
                    <span>Equipment</span>
                  </div>
                </Link>
              </li>
            </ul>
          </nav>

          <div className="mt-auto">
            <nav className="border-t border-gray-200 pt-4">
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/dashboard/lab/profile"
                    className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium text-black hover:bg-gray-100"
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium text-black hover:bg-gray-100 cursor-pointer"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Log Out</span>
                  </button>
                </li>
              </ul>
            </nav>
            <div className="bg-gray-100 p-4 rounded-lg text-center mt-6">
              <HelpCircle className="h-8 w-8 mx-auto text-[#006A6A] mb-2" />
              <h4 className="font-semibold text-black mb-1">Help center</h4>
              <p className="text-xs text-gray-600 mb-3">
                Etiam porta sem malesuada magna mollis euismod.
              </p>
              <button className="w-full bg-[#006A6A] text-white text-sm font-semibold py-2 rounded-lg hover:bg-teal-700 transition-colors">
                Go to help center
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay only for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-30 md:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default AsideNavbar;
