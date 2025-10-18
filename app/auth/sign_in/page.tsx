// app/auth/sign_in/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import CarouselSection from '@/components/carousel-section';
import { AccountTypeSidebar } from '@/components/AccSidebar';
import { handleGoogleLogin } from './actions';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [accountType, setAccountType] = useState<string>('');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get error from URL params
  const errorParam = searchParams.get('error');

  const handleAccountSelect = (type: string) => {
    setAccountType(type);
    setForm((form) => ({ ...form, role: type }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((form) => ({ ...form, [e.target.name]: undefined }));
    setApiError(null);
  };

  // TODO: Improve below validation with Zod
  const validate = () => {
    const newErrors: Partial<typeof form> = {};

    if (!/^[A-Za-z]+$/.test(form.firstName)) {
      newErrors.firstName = 'Only letters allowed';
    }
    if (!/^[A-Za-z]+$/.test(form.lastName)) {
      newErrors.lastName = 'Only letters allowed';
    }
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email';
    }
    if (!/^\d{10}$/.test(form.phone)) {
      newErrors.phone = 'Enter a valid 10-digit number';
    }
    if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!['PATIENT', 'LAB'].includes(form.role)) {
      newErrors.role = 'Invalid account type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setIsLoading(true);

    if (!validate()) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post('/api/auth/sign_in', form, {
        headers: { 'Content-Type': 'application/json' },
      });

      const data = res.data;
      console.log('Sign in response:', data);

      if (form.role === 'PATIENT') {
        router.push(`/auth/verify-otp?phone=${form.phone}`);
      } else if (form.role === 'LAB') {
        // For LAB, always redirect to lab registration page first
        router.push('/lab-registration');
      }
    } catch (err: any) {
      setApiError(err.response?.data?.error || 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAccountType('');
    setForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: '',
    });
    setErrors({});
    setApiError(null);
  };

  const handleGoogleSignIn = async () => {
    try {
      await handleGoogleLogin({ accountType });
    } catch (error: any) {
      setApiError('Google sign-in failed. Please try again.');
      console.error('Google sign-in error:', error);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body {
          font-family: 'Inter', sans-serif;
        }
      `}</style>

      <div className="bg-white flex items-center justify-center p-10">
        {!accountType && <AccountTypeSidebar onSelect={handleAccountSelect} />}

        {accountType && (
          <div className="max-w-md w-full flex flex-col justify-center">
            <div className="mb-6 text-center">
              <Image
                className="mx-auto mb-4"
                src="/labsphere-icon.svg"
                alt="Labsphere Logo"
                width={307}
                height={111}
              />
              <h2 className="text-3xl font-semibold text-gray-800 mb-2">
                Create an account
              </h2>
              <p className="text-gray-600 mt-2">
                Start your 30 days free trial
              </p>
            </div>

            {/* Display errors from URL params */}
            {errorParam && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm text-center">
                  {errorParam === 'oauth_failed'
                    ? 'Google sign-in failed. Please try again.'
                    : 'Authentication failed. Please try again.'}
                </p>
              </div>
            )}

            {/* Display API errors */}
            {apiError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm text-center">{apiError}</p>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Enter your first name"
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-teal-500"
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div className="w-1/2">
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Enter your last name"
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-teal-500"
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your e-mail"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-teal-500"
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter your phone number (10 digits)"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-teal-500"
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                )}
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-teal-500"
                />
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                )}
              </div>
              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-teal-500"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-1/2 bg-gray-200 text-gray-800 rounded-md py-2 font-semibold cursor-pointer hover:bg-gray-300 transition duration-200"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-1/2 bg-teal-600 text-white rounded-md py-2 font-semibold cursor-pointer hover:bg-teal-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Submitting...' : 'Next'}
                </button>
              </div>
            </form>

            <div className="flex items-center my-4">
              <div className="flex-grow h-px bg-gray-300" />
              <span className="mx-2 text-gray-400 text-sm">OR</span>
              <div className="flex-grow h-px bg-gray-300" />
            </div>

            <div className="flex gap-4 justify-center">
              <button
                className="cursor-pointer flex items-center gap-2 px-5 py-2 border border-black rounded-full shadow-sm hover:bg-gray-100 transition duration-200"
                onClick={handleGoogleSignIn}
              >
                <Image src="/google.svg" alt="Google" width={20} height={20} />
                <span className="text-sm font-medium">Sign in with Google</span>
              </button>
            </div>

            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{' '}
              <Link
                href={{
                  pathname: '/auth/login',
                  query: { object: JSON.stringify(accountType) },
                }}
                className="text-teal-600 hover:text-teal-700 font-medium"
              >
                Log in
              </Link>
            </p>
          </div>
        )}
      </div>

      <CarouselSection prop={'/doctor-desk.webp'} />
    </div>
  );
}
