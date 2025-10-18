// app/api/auth/oauth-callback/route.ts
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const roleParam = url.searchParams.get('role')?.toUpperCase() || '';
  const error = url.searchParams.get('error');

  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  // If there's an OAuth error from Google
  if (error) {
    console.error('OAuth error from Google:', error);
    return NextResponse.redirect(
      new URL('/auth/sign_in?error=oauth_failed', req.url)
    );
  }

  if (!code) {
    console.error('No code parameter in OAuth callback');
    return NextResponse.redirect(
      new URL('/auth/sign_in?error=missing_code', req.url)
    );
  }

  try {
    // Exchange OAuth code for session
    const { data: sessionData, error: sessionError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (sessionError) {
      console.error('Session exchange error:', sessionError);
      return NextResponse.redirect(
        new URL('/auth/sign_in?error=oauth_failed', req.url)
      );
    }

    const user = sessionData.user;
    if (!user) {
      console.error('No user data after session exchange');
      return NextResponse.redirect(
        new URL('/auth/sign_in?error=oauth_failed', req.url)
      );
    }

    console.log('Authenticated OAuth user:', user.email, user.id);

    // 2. Check if user exists in your custom users table
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id, role')
      .eq('id', user.id)
      .single();

    // If it's a "no rows" error, that's fine - user doesn't exist yet
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching user:', fetchError);
      return NextResponse.redirect(
        new URL('/auth/sign_in?error=oauth_failed', req.url)
      );
    }

    const finalRole = existingUser?.role || roleParam || 'PATIENT';

    // Upsert user in DB if they don't exist
    if (!existingUser) {
      const { error: insertError } = await supabase.from('users').insert({
        id: user.id,
        email: user.email,
        firstName: user.user_metadata?.full_name?.split(' ')[0] || '',
        lastName: user.user_metadata?.full_name?.split(' ')[1] || '',
        role: finalRole,
        provider: 'google',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      if (insertError) {
        console.error('DB insert error:', insertError);
        // Don't redirect to error page - user is authenticated, just DB insert failed
        // Continue with the flow
      }
    }

    // For LAB users, check if they need to complete registration
    if (finalRole === 'LAB') {
      const { data: lab } = await supabase
        .from('labs')
        .select('id')
        .eq('userId', user.id)
        .single();

      const redirectPath = lab ? '/dashboard' : '/lab-registration';

      const response = NextResponse.redirect(new URL(redirectPath, req.url));

      response.cookies.set('user-role', finalRole, {
        httpOnly: true,
        sameSite: 'lax', // Changed to lax for OAuth
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      });

      if (!lab) {
        response.cookies.set('lab-registered', 'false', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
        });
      }

      return response;
    }

    // For PATIENT users
    const response = NextResponse.redirect(
      new URL('/BookAppointment', req.url)
    );

    response.cookies.set('user-role', finalRole, {
      httpOnly: true,
      sameSite: 'lax', // Changed to lax for OAuth
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Unexpected error in OAuth callback:', error);
    return NextResponse.redirect(
      new URL('/auth/sign_in?error=oauth_failed', req.url)
    );
  }
}
