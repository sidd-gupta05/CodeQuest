// // app/api/send-otp/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import twilio from "twilio";

// const accountSid = process.env.TWILIO_ACCOUNT_SID!;
// const authToken = process.env.TWILIO_AUTH_TOKEN!;
// const verifySID = process.env.TWILIO_VERIFY_SID!;

// const client = twilio(accountSid, authToken);

// export async function POST(req: NextRequest) {
//   try {
//     const { phone } = await req.json();

//     if (!phone) {
//       return NextResponse.json({ success: false, error: "Phone number is required" }, { status: 400 });
//     }

//     const verification = await client.verify.v2.services(verifySID).verifications.create({
//       to: `+91${phone}`,
//       channel: "sms",
//     });

//     return NextResponse.json({ success: true, status: verification.status });
//   } catch (error: unknown) {
//     console.error("OTP send failed:", (error as Error)?.message);
//     return NextResponse.json({ success: false, error: (error as Error)?.message }, { status: 500 });
//   }
// }

// /api/send-otp
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
