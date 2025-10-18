// app/auth/sign_in/actions.ts
import { supabase } from '@/utils/supabase/client';
import axios from 'axios';

// Helper function to get the base URL
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return (
    process.env.NEXT_PUBLIC_SITE_URL || 'https://labsphere-three.vercel.app'
  );
};

export const handleGoogleLogin = async ({
  accountType,
}: {
  accountType: string;
}) => {
  const baseUrl = getBaseUrl();
  const redirectTo = `${baseUrl}/api/auth/oauth-callback?role=${accountType}`;

  console.log('OAuth redirect URL:', redirectTo);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    console.error('Google OAuth error:', error);
    throw error;
  }

  console.log('Google login initiated', data);
};

// ... rest of the functions remain the same
export async function callOAuthCallback(role: string) {
  try {
    const response = await axios.get(`/api/auth/oauth-callback`, {
      params: { role },
      withCredentials: true,
    });
    console.log('Response:', response);
  } catch (error: any) {
    console.error(
      'Error calling oauth callback:',
      error.response?.data || error.message
    );
  }
}

export const fetchOAuthCallback = async (code: string, role: string) => {
  const res = await axios.get(`/api/auth/oauth-callback`, {
    params: { code, role },
    withCredentials: true,
  });
  return res.data;
};
