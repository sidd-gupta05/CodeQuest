// app/api/send-otp
import { supabase } from '@/utils/supabase/client';

export async function POST(req: Request) {
  const { phone } = await req.json();
  const { error } = await supabase.auth.signInWithOtp({
    phone: `+91${phone}`,
    options: {
      channel: 'sms', // or 'whatsapp'
    },
  });

  if (error) {
    return Response.json({ success: false, error: error.message });
  }

  return Response.json({ success: true });
}
