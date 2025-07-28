import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

function Navbar() {
  return (
    <div>
      <nav className="backdrop-blur-md bg-gradient-to-r from-[#1e5f61]/60 to-[#0c2d34]/60 border border-white/20 rounded-full px-6 py-2 mx-auto mt-6 max-w-[95%] shadow-lg w-full flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-2 min-w-[120px]">
          <Link
            href="/"
            className="text-white font-semibold flex items-center gap-2"
          >
            <Image
              src="/logo2.svg"
              alt="Labsphere Logo"
              width={20}
              height={20}
              className="w-7 h-7"
            />
            Labsphere
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <ul className="hidden md:flex gap-8 text-white font-medium text-base justify-center flex-1">
          <li>
            <Link href="/#" className="hover:text-teal-300 transition">
              Book Appointment
            </Link>
          </li>
          <li>
            <Link href="/#" className="hover:text-teal-300 transition">
              Track report
            </Link>
          </li>
          <li>
            <Link href="/#" className="hover:text-teal-300 transition">
              Pricing
            </Link>
          </li>
          <li>
            <Link href="/#" className="hover:text-teal-300 transition">
              Contact Us
            </Link>
          </li>
        </ul>

        {/* Right: Sign Up */}
        <div className="min-w-[120px] flex justify-end">
          <Link
            href="/optionss"
            className="text-white font-semibold px-4 py-1.5 border border-white/30 rounded-full hover:bg-white/10 transition"
          >
            Sign Up
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
