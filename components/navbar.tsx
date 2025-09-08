'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { User as UserIcon, Menu, X } from 'lucide-react';
import { ProfileDropdown } from './ProfileDropdown';

function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfileData(null);
    setUserRole(null);
    setProfileDropdownOpen(false);
    router.push('/');
  };

  useEffect(() => {
    const getAndSetUser = async (currentUser: User | null) => {
      if (currentUser) {
        const { data: profile } = await supabase
          .from('users')
          .select('firstName, lastName, phone, role')
          .eq('id', currentUser.id)
          .single();
        setUser(currentUser);
        setProfileData(profile);
        setUserRole(profile?.role || null);
      } else {
        setUser(null);
        setProfileData(null);
        setUserRole(null);
      }
      setLoading(false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      getAndSetUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      getAndSetUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const navLinkClasses =
    'text-lg px-4 py-1 rounded-full transition hover:bg-white/20 hover:backdrop-blur-md hover:font-clash hover:py-2';

  const renderAuthSection = () => {
    if (loading) {
      return (
        <div className="hidden lg:flex items-center justify-end flex-shrink-0 min-w-[120px]">
          <div className="h-10 w-10 rounded-full bg-gray-300 animate-pulse"></div>
        </div>
      );
    }

    return user ? (
      <div className="hidden lg:flex items-center gap-4">
        {userRole === 'LAB' && (
          <Link
            href="/dashboard"
            className="cursor-pointer text-white font-semibold px-4 py-1.5 border border-white/30 rounded-full hover:bg-white/10 transition"
          >
            Dashboard
          </Link>
        )}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 cursor-pointer"
          >
            <UserIcon className="h-5 w-5 text-white curos-pointer" />
          </button>
          {isProfileDropdownOpen && (
            <ProfileDropdown
              user={user}
              profileData={profileData}
              onClose={() => setProfileDropdownOpen(false)}
              onLogout={handleLogout}
            />
          )}
        </div>
      </div>
    ) : (
      <button
        onClick={() => router.push('/auth/sign_in')}
        className="hidden lg:flex cursor-pointer text-white font-semibold px-4 py-1.5 border border-white/30 rounded-full hover:bg-white/10 transition"
      >
        Sign In
      </button>
    );
  };

  return (
    <>
      <nav className="relative z-50 backdrop-blur-md bg-gradient-to-r from-[#1e5f61]/60 to-[#0c2d34]/60 border border-white/20 rounded-full px-6 py-4 mx-auto mt-6 max-w-[95%] shadow-lg w-full select-none">
        <div className="flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-semibold text-white"
            >
              <Image
                src="/logo2.svg"
                alt="Labsphere Logo"
                width={28}
                height={28}
              />
              Labsphere
            </Link>
          </div>

          {/* Center: Navigation Links - Hidden on md screens */}
          <ul className="hidden lg:flex flex-1 justify-center items-center gap-2 lg:gap-4">
            <li>
              <Link href="/BookAppointment" className={navLinkClasses}>
                Book Appointment
              </Link>
            </li>
            <li>
              <Link href="/Trackreport" className={navLinkClasses}>
                Track Report
              </Link>
            </li>
            <li>
              <Link href="/pricing" className={navLinkClasses}>
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/contacts" className={navLinkClasses}>
                Contact Us
              </Link>
            </li>
          </ul>

          {/* Right: Profile dropdown or Sign Up button - Hidden on md screens */}
          <div className="hidden lg:flex items-center justify-end flex-shrink-0 min-w-[120px]">
            {renderAuthSection()}
          </div>

          {/* Hamburger for Mobile and Medium screens */}
          <div className="lg:hidden flex items-center gap-4">
            {/* Mobile profile dropdown for logged-in users */}
            {!loading && user && (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 cursor-pointer"
                >
                  <UserIcon className="h-5 w-5 text-white cursor-pointer" />
                </button>
                {isProfileDropdownOpen && (
                  <ProfileDropdown
                    user={user}
                    profileData={profileData}
                    onClose={() => setProfileDropdownOpen(false)}
                    onLogout={handleLogout}
                  />
                )}
              </div>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white corsor-pointer"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile and Medium Screen Menu */}
      {isOpen && (
        <div className="lg:hidden mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-50">
          <div className="mt-2 flex flex-col items-center gap-2 rounded-xl bg-black/50 p-4 text-white">
            <Link
              href="/BookAppointment"
              onClick={() => setIsOpen(false)}
              className={navLinkClasses}
            >
              Book Appointment
            </Link>
            <Link
              href="/Trackreport"
              onClick={() => setIsOpen(false)}
              className={navLinkClasses}
            >
              Track Report
            </Link>
            <Link
              href="/pricing"
              onClick={() => setIsOpen(false)}
              className={navLinkClasses}
            >
              Pricing
            </Link>
            <Link
              href="/contacts"
              onClick={() => setIsOpen(false)}
              className={navLinkClasses}
            >
              Contact Us
            </Link>
            <hr className="w-full border-white/20 my-2" />
            {!loading && user ? (
              <>
                {userRole === 'LAB' && (
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className={navLinkClasses}
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-red-400 px-4 py-2 rounded-full hover:bg-white/10"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push('/auth/sign_in');
                }}
                className="cursor-pointer text-white font-semibold px-4 py-1.5 border border-white/30 rounded-full hover:bg-white/10 transition"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}

      {isProfileDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setProfileDropdownOpen(false)}
        />
      )}
    </>
  );
}
export default Navbar;
