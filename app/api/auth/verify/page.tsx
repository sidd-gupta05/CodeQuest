'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CarouselSection from '@/components/carousel-section';
import { supabase } from '@/utils/supabase/client';
import Image from 'next/image';

export default function VerifyPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(60); // 60 seconds for OTP resend --required
  const [resendLoading, setResendLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone') || '';

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setError('');

    // 1) verify OTP via Supabase (which uses Twilio behind the scenes)
    const { error: otpError } = await supabase.auth.verifyOtp({
      phone: `+91${phone}`,
      token: otp.join(''),
      type: 'sms', // or "whatsapp"
    });

    if (otpError) {
      setLoading(false);
      setError('Invalid OTP. Please try again.');
      console.error('OTP verification failed:', otpError.message);
      return;
    }

    // const result = await res.json();
    setLoading(false);

    // 2) now *register* the user in your own table
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        supabaseId: user!.id,
        firstName: localStorage.getItem('firstName'),
        lastName: localStorage.getItem('lastName'),
        phone,
        email: localStorage.getItem('email'),
        role: localStorage.getItem('accountType'),
      }),
    });

    const role = user!.user_metadata.accountType;
    if (role === 'doctor') router.push('/doctor-registration');
    else if (role === 'lab') router.push('/lab-registration');
    else router.push('/dashboard');
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setError('');

    const res = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });

    const result = await res.json();
    setResendLoading(false);

    if (result.success) {
      setResendTimer(30);
    } else {
      setError('Failed to resend OTP. Try again later.');
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row max-h-screen max-w-screen">
        <div className="md:w-1/2 w-full flex flex-col justify-center px-6 md:px-16 py-10">
          <h2 className="text-2xl font-semibold mb-2">Enter OTP</h2>
          <p className="text-sm text-gray-500 mb-4">
            We have sent a code to your registered number
            <br />
            <strong>+91 {phone}</strong>
          </p>

          <div className="flex gap-2 mb-3">
            {otp.map((val, idx) => (
              <input
                key={idx}
                id={`otp-${idx}`}
                maxLength={1}
                className="w-12 h-12 text-center border rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={val}
                onChange={(e) => handleChange(idx, e.target.value)}
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full bg-teal-600 text-white py-2 rounded-lg font-semibold disabled:opacity-50 cursor-pointer hover:bg-teal-700 transition duration-200"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>

          <div className="text-center mt-4 text-sm text-gray-600">
            Didn&apos;t get the code?{' '}
            {resendTimer > 0 ? (
              <span className="text-gray-400">Resend in {resendTimer}s</span>
            ) : (
              <button
                onClick={handleResendOtp}
                disabled={resendLoading}
                className="text-teal-600 font-semibold cursor-pointer hover:underline disabled:opacity-50"
              >
                {resendLoading ? 'Sending...' : 'Resend OTP'}
              </button>
            )}
          </div>

          <div className="my-4 text-center text-sm text-gray-500">OR</div>

          <div className="flex justify-center gap-4 ">
            <button
              className="cursor-pointer"
              onClick={() =>
                supabase.auth.signInWithOAuth({ provider: 'facebook' })
              }
            >
              <Image
                rel="preload"
                src={`/facebook.svg`}
                alt={`Facebook Logo`}
                width={32}
                height={32}
                className="h-8 w-8"
              />
            </button>
            <button
              className="cursor-pointer"
              onClick={() =>
                supabase.auth.signInWithOAuth({ provider: 'google' })
              }
            >
              <Image
                rel="preload"
                src={`/google.svg`}
                alt={`Google Logo`}
                width={32}
                height={32}
                className="h-8 w-8"
              />
            </button>
            <button
              className="cursor-pointer"
              onClick={() =>
                supabase.auth.signInWithOAuth({ provider: 'apple' })
              }
            >
              <Image
                rel="preload"
                src={`/apple.svg`}
                alt={`Apple Logo`}
                width={32}
                height={32}
                className="h-8 w-8"
              />
            </button>
          </div>

          <p className="mt-4 text-sm text-center">
            Already have an account?{' '}
            <a
              href="/login"
              className="text-teal-600 font-medium hover:underline "
            >
              Log in
            </a>
          </p>
        </div>

        <CarouselSection prop="/doctor-desk.webp" />
      </div>
    </>
  );
}
