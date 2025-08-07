'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="backdrop-blur-md bg-gradient-to-r from-[#1e5f61]/60 to-[#0c2d34]/60 border border-white/20 rounded-full px-6 py-2 mx-auto mt-6 max-w-[95%] shadow-lg w-full flex items-center justify-between h-20 select-none">
        {/* Left: Logo */}
        <div className="flex items-center gap-2 min-w-[120px]">
          <Link
            href="/"
            className="text-white font-semibold flex items-center gap-2 text-xl select-none pointer-events-none"
          >
            <Image
              src="/logo2.svg"
              alt="Labsphere Logo"
              width={20}
              height={20}
              className="w-8 h-8"
            />
            Labsphere
          </Link>
        </div>

        {/* Hamburger for Mobile */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Center: Navigation Links */}
        {/* Adjusted gap for medium and larger screens */}
        <ul className="hidden md:flex gap-4 lg:gap-8 text-white font-medium text-base justify-center flex-1">
          <li>
            <Link
              href="/BookAppointment"
              className="text-lg px-4 py-1 rounded-full transition hover:bg-white/20 hover:backdrop-blur-md hover:font-clash hover:py-2"
            >
              Book Appointment
            </Link>
          </li>
          <li>
            <Link
              href="/Trackreport"
              className="text-lg px-4 py-1 rounded-full transition hover:bg-white/20 hover:backdrop-blur-md hover:font-clash hover:py-2"
            >
              Track report
            </Link>
          </li>
          <li>
            <Link
              href="/pricing"
              className="text-lg px-4 py-1 rounded-full transition hover:bg-white/20 hover:backdrop-blur-md hover:font-clash hover:py-2"
            >
              Pricing
            </Link>
          </li>
          <li>
            <Link
              href="/contacts"
              className="text-lg px-4 py-1 rounded-full transition hover:bg-white/20 hover:backdrop-blur-md hover:font-clash hover:py-2"
            >
              Contact Us
            </Link>
          </li>
        </ul>

        {/* Right: Sign Up */}
        <div className="min-w-[120px] hidden md:flex justify-end">
          <Link
            href="/optionss"
            className="text-white font-semibold px-4 py-1.5 border border-white/30 rounded-full hover:bg-white/10 transition"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-center bg-[#0c2d34] text-white gap-4 py-4 mt-2 rounded-3xl mx-auto w-[95%] shadow-lg">
          <Link href="/BookAppoientment">Book Appointment</Link>
          <Link href="/Trackreport">Track report</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/contacts">Contact Us</Link>
          <Link
            href="/optionss"
            className="text-white font-semibold px-4 py-1.5 border border-white/30 rounded-full hover:bg-white/10 transition text-xl"
          >
            Sign Up
          </Link>
        </div>
      )}
    </>
  );
}

export default Navbar;
