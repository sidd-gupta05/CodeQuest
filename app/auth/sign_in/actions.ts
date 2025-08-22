import { supabase } from "@/utils/supabase/client";
+
const handleGoogleLogin = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/oauth-callback?role=${accountType}`,
    },
  });
  if (error) console.error(error);
};
