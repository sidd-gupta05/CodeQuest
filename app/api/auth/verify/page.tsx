'use client';

import { useEffect, useState, useRef, FormEvent, KeyboardEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import CarouselSection from '@/components/carousel-section'; // Assuming this component exists
import Image from 'next/image';

// A simple spinner component for loading states
const Spinner = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg
    className={`animate-spin ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export default function VerifyPage() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [resendLoading, setResendLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone') || '';
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown effect for resending OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  // Focus the first input on component mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to the next input if a digit is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    // Move focus to the previous input on backspace if the current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^[0-9]{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true);
    setError('');

    if (otp.join('').length !== 6) {
      setError('Please enter the complete 6-digit OTP.');
      setLoading(false);
      return;
    }

    // 1) Verify OTP with Supabase
    const { error: otpError } = await supabase.auth.verifyOtp({
      phone: `+91${phone}`,
      token: otp.join(''),
      type: 'sms',
    });

    if (otpError) {
      setLoading(false);
      setError('Invalid or expired OTP. Please try again.');
      console.error('OTP verification failed:', otpError.message);
      return;
    }

    // 2) Register the user in your custom 'users' table
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found after verification.');

      await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supabaseId: user.id,
          firstName: localStorage.getItem('firstName'),
          lastName: localStorage.getItem('lastName'),
          phone,
          email: localStorage.getItem('email'),
          role: localStorage.getItem('accountType'),
        }),
      });

      // 3) Redirect based on role
      const role = localStorage.getItem('accountType');
      if (role === 'doctor') router.push('/doctor-registration');
      else if (role === 'lab') router.push('/lab-registration');
      else router.push('/dashboard');
    } catch (regError) {
      setLoading(false);
      setError('Failed to finalize your registration. Please contact support.');
      console.error('Registration API or redirection failed:', regError);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setError('');

    // Use Supabase's built-in resend functionality
    const { error: resendError } = await supabase.auth.resend({
      type: 'sms',
      phone: `+91${phone}`,
    });

    setResendLoading(false);

    if (resendError) {
      setError('Failed to resend OTP. Please try again in a moment.');
      console.error('Resend OTP failed:', resendError.message);
    } else {
      setResendTimer(60); // Reset timer
      setOtp(Array(6).fill('')); // Clear OTP fields
    }
  };

  return (
    <>
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 select-none">
        {/* Left Section */}
        <div className="bg-white flex items-center justify-center p-10">
          <div className="max-w-md w-full flex flex-col justify-center">
            <Image
              className="mx-auto mb-6"
              src="/labsphere-icon.svg"
              alt="Labsphere Logo"
              width={300}
              height={60}
            />

            <button
              onClick={() => router.back()}
              className="text-gray-600 text-sm mb-4 flex items-center cursor-pointer"
            >
              ← Back
            </button>

            <h1 className="text-3xl font-bold text-gray-800 mb-2">Enter OTP</h1>
            <p className="text-gray-500 mb-6">
              A 6-digit code has been sent to your number:
              <br />
              <strong className="text-gray-700">+91 {phone}</strong>
            </p>

            <form onSubmit={handleVerify} className="space-y-6">
              <div className="flex justify-center gap-3" onPaste={handlePaste}>
                {otp.map((val, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    id={`otp-${idx}`}
                    type="tel"
                    maxLength={1}
                    className={`w-12 h-14 text-center border rounded-md text-xl font-semibold focus:outline-none transition-all duration-200 ${
                      error
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-gray-300 focus:border-teal-500'
                    }`}
                    value={val}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                  />
                ))}
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || otp.join('').length !== 6}
                className="w-full bg-teal-600 text-white rounded-md py-2 font-semibold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
                {!loading && <span>→</span>}
              </button>
            </form>

            <div className="text-center mt-6 text-sm text-gray-600">
              Didn't receive the code?{' '}
              {resendTimer > 0 ? (
                <span className="text-gray-400">Resend in {resendTimer}s</span>
              ) : (
                <button
                  onClick={handleResendOtp}
                  disabled={resendLoading}
                  className="text-teal-600 font-semibold hover:underline disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {resendLoading ? 'Sending...' : 'Resend OTP'}
                </button>
              )}
            </div>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">OR</span>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              {[
                // { provider: 'google', icon: 'google.svg' },
                // { provider: 'facebook', icon: 'facebook.svg' },
                // { provider: 'apple', icon: 'apple.svg' },
              ].map(({ provider, icon }) => (
                <button
                  key={provider}
                  onClick={() =>
                    supabase.auth.signInWithOAuth({ provider: provider as any })
                  }
                  className="flex items-center justify-center w-10 h-10 bg-white border border-gray-300 rounded-full hover:bg-gray-50 focus:outline-none transition"
                  aria-label={`Sign in with ${provider}`}
                >
                  <Image
                    src={`/${icon}`}
                    alt={`${provider} logo`}
                    width={20}
                    height={20}
                  />
                </button>
              ))}
            </div>

            {/* <p className="mt-8 text-sm text-center text-gray-600">
              Already have an account?{' '}
              <a
                href="/login"
                className="font-medium text-teal-600 hover:underline"
              >
                Log in
              </a>
            </p> */}
          </div>
        </div>

        {/* Right Section */}
        <CarouselSection prop="/doctor-registration-illustration.webp" />
      </div>
    </>
  );
}
