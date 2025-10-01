'use client';

import { useEffect, useState, useRef, FormEvent, KeyboardEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import CarouselSection from '@/components/carousel-section';
import Image from 'next/image';

export default function VerifyPage() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [payload, setPayload] = useState<Record<string, any> | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone') || '';
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  /** normalize phone → ensures only single +91 prefix */
  const normalizePhone = (num: string) => {
    return num.replace(/^(\+91)?\+91/, '+91');
  };

  // restore resend timer from localStorage
  useEffect(() => {
    const lastSent = localStorage.getItem('otpLastSent');
    if (lastSent) {
      const diff = 60 - Math.floor((Date.now() - Number(lastSent)) / 1000);
      if (diff > 0) setTimeLeft(diff);
    }
  }, []);

  // countdown effect
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  // focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // fetch payload from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem('signupPayload');
    if (saved) {
      setPayload(JSON.parse(saved));
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^[0-9]{6}$/.test(pastedData)) {
      setOtp(pastedData.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit OTP.');
      setLoading(false);
      return;
    }

    try {
      if (!payload) {
        setError('No payload found');
        setLoading(false);
        return;
      }

      payload.code = code;
      payload.phone = normalizePhone(`${payload.phone}`);

      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'OTP verification failed');
      } else {
        console.log('Success:', data);
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Request failed', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setError('');

    const { error: resendError } = await supabase.auth.signInWithOtp({
      phone: normalizePhone(`+91${phone}`),
    });

    setResendLoading(false);

    if (resendError) {
      setError('Failed to resend OTP. Please try again in a moment.');
      console.error('Resend OTP failed:', resendError.message);
    } else {
      localStorage.setItem('otpLastSent', Date.now().toString());
      setTimeLeft(60);
    }
  };

  return (
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
            <strong className="text-gray-700">
              {normalizePhone(`+91${phone}`)}
            </strong>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-3" onPaste={handlePaste}>
              {otp.map((val, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
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
            Didn&apos;t receive the code?{' '}
            {timeLeft > 0 ? (
              <span className="text-gray-400">Resend in {timeLeft}s</span>
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
        </div>
      </div>

      {/* Right Section */}
      <CarouselSection prop="/doctor-registration-illustration.webp" />
    </div>
  );
}
