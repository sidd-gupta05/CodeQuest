// app/api/send-otp
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Check for env vars during build
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    // During build, return a dummy response
    if (process.env.NODE_ENV === 'production') {
      console.log('Build-time: Supabase env vars not available');
      return NextResponse.json(
        { error: 'Service unavailable during build' },
        { status: 503 }
      );
    }

    // During runtime, this should never happen
    return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
  }

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { phone } = await req.json();
  const { error } = await supabase.auth.signInWithOtp({
    phone: `+91${phone}`,
    options: {
      channel: 'sms', // or 'whatsapp'
    },
  });

  if (error) {
    return Response.json({ success: false, error: error.message });
  }

  return Response.json({ success: true });
}
