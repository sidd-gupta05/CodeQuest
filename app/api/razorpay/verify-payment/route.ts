import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Handle different possible field names from Razorpay
    const orderId =
      body.razorpay_order_id || body.razorpayOrderId || body.orderId;
    const paymentId =
      body.razorpay_payment_id || body.razorpayPaymentId || body.paymentId;
    const signature =
      body.razorpay_signature || body.razorpaySignature || body.signature;

    // Validate required fields
    if (!orderId || !paymentId || !signature) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required payment verification data',
          received: body,
        },
        { status: 400 }
      );
    }

    // Generate expected signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    // Verify signature
    const isValid = expectedSignature === signature;

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid payment signature',
          details: 'Payment verification failed',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      paymentId: paymentId,
      orderId: orderId,
      message: 'Payment verified successfully',
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
