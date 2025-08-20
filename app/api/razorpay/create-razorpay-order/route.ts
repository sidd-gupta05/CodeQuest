// app/api/razorpay/create-razorpay-order/route.ts
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const order = await razorpay.orders.create({
      amount: body.amount,
      currency: body.currency || 'INR',
      receipt: body.receipt,
      notes: body.notes,
    });

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error('Razorpay error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create order',
        details: error.error?.description || error.message,
      },
      { status: 500 }
    );
  }
}
