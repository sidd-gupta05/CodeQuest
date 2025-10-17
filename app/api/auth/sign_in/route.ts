// app/api/auth/sign_in/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);
  const form = await req.json();

  console.log('Received form data:', form);

  const formRole = form.role?.toUpperCase();
  if (!formRole) {
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

  const role = formRole;

  if (role === 'LAB') {
    try {
      // 1. Sign up using email/password
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            firstName: form.firstName,
            lastName: form.lastName,
            phone: form.phone,
            role,
          },
        },
      });

      if (signUpError) {
        console.log('Signup error:', signUpError.message);
        return NextResponse.json(
          { error: signUpError.message },
          { status: 400 }
        );
      }

      const user = signUpData.user;
      if (!user) {
        return NextResponse.json(
          { error: 'User creation failed' },
          { status: 400 }
        );
      }

      // 2. Insert into users table
      const { error: insertUserError } = await supabase.from('users').insert({
        id: user.id,
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      if (insertUserError) {
        console.log('User insert error:', insertUserError);
        // Don't return error here - user was created in auth, just DB insert failed
      }

      // For new LAB users, set lab-registered as false
      const response = NextResponse.json(
        { 
          success: true, 
          message: 'Lab user created successfully',
          user: { id: user.id, email: user.email }
        },
        { status: 200 }
      );

      // Set lab-registered as false to indicate they need to complete registration
      response.cookies.set('lab-registered', 'false', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });
      response.cookies.set('user-role', role, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      });
      
      return response;
    } catch (e: any) {
      console.error('Lab Auth failed:', e);
      await supabase.auth.signOut();

      return NextResponse.json(
        { error: 'User signup failed', details: e.message },
        { status: 500 }
      );
    }
  }

  if (role === 'PATIENT') {
    // ... existing PATIENT code ...
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