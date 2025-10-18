// middleware.ts
import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function middleware(request: NextRequest) {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL or Anon Key is missing.');
  }

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const role = request.cookies.get('user-role')?.value;
  const labRegistered = request.cookies.get('lab-registered')?.value === 'true';

  // Check if lab exists in database for this user
  let labExists = false;
  if (user && role === 'LAB') {
    const { data: lab } = await supabase
      .from('labs')
      .select('id')
      .eq('userId', user.id)
      .single();
    labExists = !!lab;
  }

  console.log('Middleware debug:', {
    user: user?.id,
    role,
    labRegistered,
    labExists,
    pathname,
  });

  // 🔒 Protected routes - require authentication
  const protectedPaths = [
    '/dashboard',
    '/lab-registration',
    '/BookAppointment',
  ];

  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(path)
  );

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/sign_in';
    return NextResponse.redirect(url);
  }

  // 🔐 LAB-specific logic
  if (user && role === 'LAB') {
    // If lab doesn't exist in database AND user is not marked as registered, redirect to lab-registration
    if (!labExists && !labRegistered && pathname !== '/lab-registration') {
      const url = request.nextUrl.clone();
      url.pathname = '/lab-registration';
      console.log('Redirecting to lab registration - lab does not exist');
      return NextResponse.redirect(url);
    }

    // If lab exists in database OR user is marked as registered, allow access to dashboard
    // but prevent access to lab-registration
    if ((labExists || labRegistered) && pathname === '/lab-registration') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      console.log('Redirecting to dashboard - lab already registered');
      return NextResponse.redirect(url);
    }

    // Prevent LAB from accessing patient routes
    if (pathname === '/BookAppointment') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  // 🔐 PATIENT-specific logic
  if (user && role === 'PATIENT') {
    // Prevent patients from accessing lab routes
    if (pathname === '/dashboard' || pathname === '/lab-registration') {
      const url = request.nextUrl.clone();
      url.pathname = '/BookAppointment';
      return NextResponse.redirect(url);
    }
  }

  // 🔁 Redirect authenticated users away from auth pages
  if (user && ['/auth/sign_in', '/auth/login'].includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = role === 'LAB' ? '/dashboard' : '/BookAppointment';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
