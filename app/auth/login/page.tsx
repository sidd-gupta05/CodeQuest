'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/utils/supabase/client';
import Link from 'next/link';
import { handleGoogleLogin } from '../sign_in/actions';

const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or phone is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  

  const objectParam = searchParams.get('object');
  const accountType = objectParam ? JSON.parse(objectParam) : 'PATIENT';
  console.log({ accountType });

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    const identifier = values.identifier.trim();
    const isEmail = identifier.includes('@');

    //TODO: krrish - fetch user by email/phone and check if provider is google, if yes show error to login with google
    try {
      let { data: userByEmail, error: lookupError } = await supabase
        .from('users')
        .select('id, provider')
        .eq('email', identifier)
        .single();

      if (lookupError) {
        const errorMessage = lookupError.message || '';
        const isNoRowsError = errorMessage.includes(
          'JSON object requested, multiple (or no) rows returned'
        );

        if (!isNoRowsError) {
        }
      }

      if (userByEmail?.provider === 'google') {
        form.setError('identifier', {
          message:
            'This email is registered with Google. Please login with Google instead.',
        });
        return;
      }

      let data, error;
      if (isEmail) {
        ({ data, error } = await supabase.auth.signInWithPassword({
          email: identifier,
          password: values.password,
        }));
      } else {
        ({ data, error } = await supabase.auth.signInWithPassword({
          phone: `+91${identifier}`,
          password: values.password,
        }));
      }

      if (error) {
        console.error('Login error:', error.message);
        form.setError('identifier', { message: 'Invalid credentials' });
        return;
      }

      const userId = data.user?.id;
      if (!userId) return;

      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (profileError || !profile) {
        console.error(profileError);
        return;
      }

      if (profile.role === 'LAB') {
        router.push('/dashboard');
      } else {
        router.push('/BookAppointment');
      }
    } catch (err) {
      console.error('Unexpected login error:', err);
      form.setError('identifier', {
        message: 'Something went wrong. Try again.',
      });
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left column */}
      <div className="bg-white flex items-center justify-center p-10">
        <div className="max-w-md w-full">
          <div className="mb-6 text-center">
            <Image
              className="mx-auto mb-4"
              src="/labsphere-icon.svg"
              alt="Labsphere Logo"
              width={300}
              height={111}
            />
            <h2 className="text-4xl font-semibold text-gray-800 mb-2">Login</h2>
            <p className="text-gray-600 text-xl">Welcome back! Please login.</p>
          </div>

          {/* Plain Tailwind form but still wired with RHF */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Email or Phone"
                {...form.register('identifier')}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
              {form.formState.errors.identifier && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.identifier.message}
                </p>
              )}
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                {...form.register('password')}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
              {form.formState.errors.password && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full bg-teal-600 text-white rounded-md py-2 font-semibold hover:bg-teal-700"
            >
              Login
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="mx-2 text-gray-400 text-sm">OR</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          {/* Social Login */}
          <div className="flex gap-4 justify-center">
            <button
              className="flex cursor-pointer items-center gap-2 px-5 py-2 border border-black rounded-full shadow-sm hover:bg-gray-100 transition duration-200"
              onClick={() => handleGoogleLogin({ accountType })}
            >
              <Image src="/google.svg" alt="Google" width={20} height={20} />
              <span className="text-sm font-medium">Login with Google</span>
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don&#39;t have an account?{' '}
            <Link href="/auth/sign_in" className="text-teal-600">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right column */}
      <div
        className="hidden md:flex items-center justify-center p-10"
        style={{
          background:
            'linear-gradient(26.61deg, #05303B 0.93%, #2B7C7E 101.37%)',
        }}
      >
        <Image
          src="/doctor-desk.webp"
          alt="Doctor at desk"
          width={500}
          height={600}
          className="mx-auto"
        />
      </div>
    </div>
  );
}
