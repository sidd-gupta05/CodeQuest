// /api/auth/logout.ts
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);
    
    // Properly await the signOut operation
    await supabase.auth.signOut();
    
    // Redirect to / page
    const res =  NextResponse.json(
      { success: true, message: 'logout successful' },
      { status: 200 }
    );

  // Clear the user-role cookie
    res.cookies.set('user-role', '', { maxAge: 0, path: '/' });
    res.cookies.set('user-aud', '', { maxAge: 0, path: '/' });
    return res;
    
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to logout' },
      { status: 500 }
    );
  }
}

// Keep GET for backward compatibility if needed
export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);
    
    await supabase.auth.signOut();
    
    return NextResponse.redirect(
      new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.redirect(
      new URL('/auth/login?error=logout_failed', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
    );
  }
}
