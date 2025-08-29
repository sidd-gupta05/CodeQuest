// app/api/auth/sign_in/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const supabase = await createClient(cookies());
  const form = await req.json();

  //TODO: create all necessary interface
  console.log('Received form data:', form);

  const role = form.role?.toUpperCase();
  console.log(role);

  if (!role) {
    return NextResponse.json(
      { error: 'Invalid account type' },
      { status: 400 }
    );
  }

  // --- Pre-check for duplicate email ---
  const { data: existingEmail } = await supabase
    .from('users')
    .select('id')
    .eq('email', form.email)
    .single();

  if (existingEmail) {
    return NextResponse.json(
      { error: 'Email already registered' },
      { status: 400 }
    );
  }

  // --- Pre-check for duplicate phone ---
  const { data: existingPhone } = await supabase
    .from('users')
    .select('id')
    .eq('phone', form.phone)
    .single();

  if (existingPhone) {
    return NextResponse.json(
      { error: 'Phone already registered' },
      { status: 400 }
    );
  }

  if (role === 'LAB') {
    // 1. Sign up using email/password
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            firstName: form.firstName,
            lastName: form.lastName,
            phone: form.phone,
            role,
          },
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/lab-registration`,
        },
      });

      if (signUpError) {
        console.log(signUpError.message);
        return NextResponse.json(
          { error: signUpError.message },
          { status: 400 }
        );
      }

      // 2. Get authenticated user
      const {
        data: { user },
        error: getUserError,
      } = await supabase.auth.getUser();

      // 2. Check if user exists in your custom users table
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('id, role')
        .eq('id', user?.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        return NextResponse.redirect(
          new URL('/auth/sign_in?error=oauth_failed', req.url)
        );
      }

      // 3. Insert into users table (optional - use your own table schema)
      if (!existingUser) {
        const { error: insertUserError } = await supabase.from('users').upsert({
          id: user?.id,
          email: form.email,
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          role,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        if (insertUserError) {
          console.log(insertUserError);
          return NextResponse.json(
            {
              error: 'User signup succeeded but DB insert failed',
              dbError: insertUserError.message,
            },
            { status: 500 }
          );
        }
      }

      const response = NextResponse.redirect(
        new URL('/lab-registration', req.url)
      );
      response.cookies.set('user-role', role, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      });
      return response;
    } catch (e: any) {

      console.error('Lab Auth failed:', e.status, e.code, e.message);
      await supabase.auth.signOut();

      return NextResponse.json(
        { error: 'User signup failed', details: e.message },
        { status: 500 }
      );
    }
  }

  if (role === 'PATIENT') {
    // 4. Sign in with OTP (phone-based)
    const { error: otpError } = await supabase.auth.signInWithOtp({
      phone: `+91${form.phone}`,
      options: {
        channel: 'sms',
        data: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          role,
        },
      },
    });

    if (otpError) {
      return NextResponse.json({ error: otpError.message }, { status: 400 });
    }

    return NextResponse.json({ success: 200 });
  }

  return NextResponse.json({ error: 'Unhandled case' }, { status: 400 });
}
