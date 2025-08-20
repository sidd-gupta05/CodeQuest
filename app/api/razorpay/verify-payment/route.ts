// app/api/razorpay/verify-payment/route.ts
'use server';

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

    if (
      !body.razorpay_order_id ||
      !body.razorpay_payment_id ||
      !body.razorpay_signature
    ) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

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
