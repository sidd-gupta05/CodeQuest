import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import bcrypt from 'bcrypt';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  if (!process.env.TWILIO_VERIFY_SID) {
    console.error('TWILIO_VERIFY_SID is not defined');
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    console.log('Request body:', body);
    const { phone, code, email, firstName, lastName, role } = body;

    if (!phone || !code || !email || !firstName || !lastName || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verificationChecks.create({
        to: phone,
        code: code,
      });

    if (verificationCheck.status !== 'approved') {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    console.log('Verification success:', verificationCheck.accountSid, verificationCheck.status);

    // Get authenticated user
    const {
      data: { user },
      error: getUserError,
    } = await supabase.auth.getUser();

    // Hash password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into users table
    const { data, error: insertUserError } = await supabase
      .from('users')
      .upsert({
        id: user?.id,
        email,
        firstName,
        lastName,
        phone,
        role,
        password: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

    if (insertUserError) {
      console.error('DB insert error:', insertUserError);
      return NextResponse.json(
        {
          error: 'User signup succeeded but DB insert failed',
          dbError: insertUserError.message,
        },
        { status: 500 }
      );
    }

    console.log('User inserted:', data);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('OTP verification failed:', error.status, error.code, error.message);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}