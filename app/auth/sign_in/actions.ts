import { supabase } from "@/utils/supabase/client";
import axios from 'axios';

export const handleGoogleLogin = async (role: string) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/oauth-callback?role=${role}`,
    },
  });
  if (error) console.error(error);
};

export async function callOAuthCallback(role: string) {
  try {
    const response = await axios.get(`/api/auth/oauth-callback`, {
      params: { role }, // send role as query param
      withCredentials: true // ensure cookies/session are sent
    });

    // Axios will follow redirects by default in browsers
    console.log('Response:', response);
  } catch (error: any) {
    console.error('Error calling oauth callback:', error.response?.data || error.message);
  }
}

export const fetchOAuthCallback = async (code: string, role: string) => {
  const res = await axios.get(`/api/auth/oauth-callback`, {
    params: { code, role },
    withCredentials: true, // important to allow cookies
  });
  return res.data;
};