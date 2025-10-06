// app/api/auth/oauth-callback/route.ts
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const roleParam = url.searchParams.get('role')?.toUpperCase() || 'PATIENT';

  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  if (!code) {
    return NextResponse.redirect(
      new URL('/auth/sign_in?error=missing_code', req.url)
    );
  }

  // Exchange OAuth code for session
  const { data: sessionData, error: sessionError } =
    await supabase.auth.exchangeCodeForSession(code);
  if (sessionError) {
    return NextResponse.redirect(
      new URL('/auth/sign_in?error=oauth_failed', req.url)
    );
  }

  const user = sessionData.user;
  console.log('Authenticated OAuth user:', user);

  // 2. Check if user exists in your custom users table
  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('id, role')
    .eq('id', user.id)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    return NextResponse.redirect(
      new URL('/auth/sign_in?error=oauth_failed', req.url)
    );
  }

  const finalRole = existingUser?.role || roleParam;

  // Upsert user in DB
  if (!existingUser) {
    const { error: insertError } = await supabase.from('users').insert({
      id: user.id,
      email: user.email,
      firstName: user.user_metadata?.full_name?.split(' ')[0] || '',
      lastName: user.user_metadata?.full_name?.split(' ')[1] || '',
      role: finalRole,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    if (insertError) {
      return NextResponse.json(
        {
          error: 'User signup succeeded but DB insert failed',
          dbError: insertError.message,
        },
        { status: 500 }
      );
    }
  }

  //TODO: Gotta modify labs api to redirect not yet registered labs to lab-registration
  // Set role cookie (HTTP-only)
  const response = NextResponse.redirect(
    new URL(finalRole === 'LAB' ? '/lab-registration' : '/bookAppointment', req.url)
  );
  response.cookies.set('user-role', finalRole, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
  return response;
}
