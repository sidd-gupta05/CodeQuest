// /api/auth/verify-otp/route.ts
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const verifyOtpSchema = z.object({
  phone: z.string().min(10),
  code: z.string().length(6),
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.enum(['PATIENT', 'DOCTOR']),
});

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  function normalizePhone(phone: string) {
    return phone.replace(/^(\+91)?\+91/, '+91'); // collapse duplicate +91
  }

  try {
    const body = await req.json();
    const parsed = verifyOtpSchema.safeParse(body);

    console.log('Request body:', body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parsed.error.message },
        { status: 400 }
      );
    }

    const { phone, code, email, firstName, lastName, role } = parsed.data;

    if (!phone || !code || !email || !firstName || !lastName || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('Sending OTP to:', normalizePhone(phone));
    console.log('Verifying OTP for:', phone, 'with code:', code);

    // ✅ Verify OTP directly with Supabase
    const { data, error } = await supabase.auth.verifyOtp({
      phone: `+91${normalizePhone(phone)}`,
      token: code,
      type: 'sms',
    });

    if (error) {
      console.error('OTP verification failed:', error);
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    //enable below to see detailed log
    // console.log('Verification success:', data);

    const user = data.user;

    // Insert into users table
    // TODO: I want zod to be used since doing insert op in db is making a hassle in testing
    const { error: insertUserError } = await supabase.from('users').upsert({
      id: user?.id,
      email,
      firstName,
      lastName,
      phone,
      role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // OTP verification is Patient only we also gonna insert patient data
    // TODO: Use Zod for validation and current patient insert is prototype
    const { error: insertPatientError } = await supabase
      .from('patients')
      .upsert({
        id: uuidv4(),
        userId: user?.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

    if (insertUserError || insertPatientError) {
      if (insertPatientError?.code === '23505') {
        // User already exists, return gracefully
        return NextResponse.json(
          { status: 'exists', user: user },
          { status: 200 }
        );
      }
      console.error('DB insert error:', insertUserError);
      console.error('DB insert error:', insertPatientError);

      //TODO: Fuck, I don't know what am I doing now
      await supabase.auth.signOut();

      return NextResponse.json(
        {
          error: 'User signup succeeded but DB insert failed',
          dbError: `${insertUserError?.message},
                    ${insertPatientError?.message}`,
        },
        { status: 500 }
      );
    }

    console.log('User inserted:', data);

    const response = NextResponse.redirect(
      new URL('/BookAppointment', req.url)
    );
    response.cookies.set('user-role', role, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
    return response;
  } catch (error: any) {
    console.error(
      'OTP verification failed:',
      error.status,
      error.code,
      error.message
    );

    await supabase.auth.signOut();

    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
