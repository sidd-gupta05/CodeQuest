import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createClient = async (request: NextRequest) => {
  // Validate environment variables
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Supabase URL or Anon Key is missing. Please check your environment variables.'
    );
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

  // Define public and lab-specific paths
  const publicPaths = ['/', '/register', '/auth/sign_in', '/verify-otp', '/lab-registration'];
  // Define protected paths (require authentication)
  const protectedPaths = ['/verify-otp', '/lab-registration', '/dashboard'];
  const labPaths = ['/dashboard'];

  // Check if the current path is public
  const isPublicPath = publicPaths.some((path) => pathname === path || pathname.startsWith(path));

  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some((path) => pathname === path || pathname.startsWith(path));

  // Check if the current path is lab-specific
  const isLabPath = labPaths.some((path) => pathname.startsWith(path));

// 🔐 Redirect unauthenticated users trying to access protected or non-public pages
  if (!user && (isProtectedPath || !isPublicPath)) {
    console.log('Redirecting to login page:', pathname);
    const url = request.nextUrl.clone();
    url.pathname = '/auth/sign_in';
    return NextResponse.redirect(url);
  }

  // 🔐 Redirect LAB users to /dashboard if they access public or lab paths
  if (user && user.role === 'LAB' && (isLabPath || isPublicPath)) {
    console.log('Redirecting LAB user to dashboard:', pathname);
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

// 🔁 Redirect authenticated users trying to access auth pages
  if (
    user &&
    ['/auth/sign_in', '/register'].includes(pathname)
  ) {
    console.log('Redirecting authenticated user:', pathname, 'Role:', user.role);
    const url = request.nextUrl.clone();
    url.pathname = user.role === 'LAB' ? '/dashboard' : '/BookAppointment';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
};