// import type { NextApiRequest, NextApiResponse } from 'next';
// import crypto from 'crypto';

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }

//   const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
//     req.body;

//   const body = `${razorpay_order_id}|${razorpay_payment_id}`;
//   const expectedSignature = crypto
//     .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
//     .update(body)
//     .digest('hex');

//   const isAuthentic = expectedSignature === razorpay_signature;

//   if (isAuthentic) {
//     // Here you would typically save to your database
//     res.status(200).json({ success: true });
//   } else {
//     res.status(400).json({ success: false });
//   }
// }

import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Here you would typically save the payment details to your database
    // For example:
    // await savePaymentToDatabase({
    //   orderId: razorpay_order_id,
    //   paymentId: razorpay_payment_id,
    //   amount: body.amount,
    //   status: 'completed',
    //   // other relevant details
    // });

    return NextResponse.json({
      success: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Payment verification failed',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
