import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// NOTE: below code is necessary duplicate due to middleware context being different from server context
export const createClient = async (request: NextRequest) => {
  // Validate environment variables
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL or Anon Key is missing.');
  }

  // Create an unmodified response
  const supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        // we check req header instead of cookies here // main difference
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // TODO: Sorting below paths asap also what are patient only routes here?
  // ✅ Define protected paths
  const protectedPaths = [
    '/register',
    '/login',
    '/verify-otp',
    '/dashboard',
    '/lab-registration',
    '/api/booking/payment',
    '/api/auth/logout',
  ];

  // 🔒 Check if the current path is protected
  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(path)
  );

  // 🔐 Require login for protected routes
  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/sign_in';
    return NextResponse.redirect(url);
  }

  if (user) {
    // console.log('Authenticated user:', user.id);
    const role = user.role;
    // console.log('Authenticated user:', user.email, 'Role:', role);

    //redirect non-patient from lab to book appointment
    if (
      ['/auth/sign_in', '/register', '/dashboard'].includes(pathname) &&
      role !== 'LAB'
    ) {
      const url = request.nextUrl.clone();
      url.pathname = '/BookAppointment'; // redirect them somewhere safe
      return NextResponse.redirect(url);
    }

    // 🔁 Redirect authenticated users trying to access auth pages
    if (user && ['/auth/sign_in', '/register'].includes(pathname)) {
      console.log(
        'Redirecting authenticated user:',
        pathname,
        'Role:',
        user.user_metadata.role
      );
      const url = request.nextUrl.clone();
      url.pathname =
        user.user_metadata.role === 'LAB' ? '/dashboard' : '/BookAppointment';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
};