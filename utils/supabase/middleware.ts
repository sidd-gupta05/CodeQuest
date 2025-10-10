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

  //TODO:Optimize the code to avoid multiple calls to getUser
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
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

  let role = request.cookies.get('user-role')?.value;
  console.log('User role from cookie:', role);
  const labRegistered = request.cookies.get('lab-registered')?.value === 'true';

  // 🔒 Prevent lab users who are already registered from accessing lab-registration
  if (
    user &&
    role === 'LAB' &&
    pathname === '/lab-registration' &&
    labRegistered
  ) {
    // toast.success('Lab already registered, redirecting to dashboard');
    const url = request.nextUrl.clone();  
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // fallback to DB if cookie missing and user present (rare case)
  if (user && !role) {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();
    role = profile?.role;
    if (role) {
      supabaseResponse.cookies.set('user-role', role, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      });
    }
  }

  if (user) {
    supabaseResponse.cookies.set('user-aud', String(user.aud), {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
    // console.log('Authenticated user:', user);
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
      console.log('Redirecting authenticated user:', pathname, 'Role:', role);
      const url = request.nextUrl.clone();
      url.pathname = role === 'LAB' ? '/dashboard' : '/BookAppointment';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
};
