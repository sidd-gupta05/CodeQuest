// app/api/auth/oauth-callback/route.ts
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const role = url.searchParams.get('role')?.toUpperCase() || 'PATIENT';

  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  if (code) {
    // Exchange OAuth code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(new URL('/auth/sign_in?error=oauth_failed', req.url));
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log('Authenticated user:', user);

  if (!user) {
    return NextResponse.redirect(new URL('/auth/sign_in', req.url));
  }

  // Upsert user in DB
  const { error: insertUserError } = await supabase.from('users').upsert({
    id: user.id,
    email: user.email,
    firstName: user.user_metadata?.full_name?.split(' ')[0] || '',
    lastName: user.user_metadata?.full_name?.split(' ')[1] || '',
    role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  if (insertUserError) {
    return NextResponse.json(
      {
        error: 'User signup succeeded but DB insert failed',
        dbError: insertUserError.message,
      },
      { status: 500 }
    );
  }

  const redirectPath = role === 'LAB' ? '/lab-registration' : '/dashboard';
  return NextResponse.redirect(new URL(redirectPath, req.url));
}
