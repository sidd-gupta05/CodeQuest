// app/api/auth/sign_in/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const supabase = await createClient(cookies());
  const form = await req.json();

  console.log('Received form data:', form);

  const role =  form.role?.toUpperCase();
  console.log(role)
  
  if (!role) {
    return NextResponse.json({ error: 'Invalid account type' }, { status: 400 });
  }

  if (role === 'LAB') {
    // 1. Sign up using email/password
    const { error: signUpError } = await (await supabase).auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          role,
          // TODO: Hash the password before storing
          password: form.password,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/lab-registration`,
      },
    });

    if (signUpError) {
      console.log(signUpError.message)
      return NextResponse.json({ error: signUpError.message }, { status: 400 });
    }

    // 2. Get authenticated user
    const {
      data: { user },
      error: getUserError,
    } = await (await supabase).auth.getUser();

    if (getUserError || !user) {
      return NextResponse.json({ error: 'Could not fetch user' }, { status: 500 });
    }

    // 3. Insert into users table (optional - use your own table schema)
    const { error: insertUserError } = await (await supabase).from('users').upsert({
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
      return NextResponse.json(
        { error: 'User signup succeeded but DB insert failed', dbError: insertUserError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      redirect: `/${role.toLowerCase()}-registration`,
    });
  }

  if (role === 'PATIENT') {
    // 4. Sign in with OTP (phone-based)
    const { error: otpError } = await supabase.auth.signInWithOtp({
      phone: `+91${form.phone}`,
      options: { channel: 'sms' },
    });

    if (otpError) {
      return NextResponse.json({ error: otpError.message }, { status: 400 });
    }

    // TODO: Might have to store form data in Session rather than search query
    return NextResponse.json({
      success: true,
      redirect: `/api/auth/verify?firstName=${form.firstName}&lastName=${form.lastName}&email=${form.email}&phone=${form.phone}&role=${role}`,
      payload: {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        role,
        password: form.password, // if needed
      },
    });
  }

  return NextResponse.json({ error: 'Unhandled case' }, { status: 400 });
}
