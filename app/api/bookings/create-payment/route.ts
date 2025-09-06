import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      bookingId,
      status,
      amount,
      paidAt,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = await request.json();

    const paymentId = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    // Create payment record with only the fields that exist in the schema
    const { data: payment, error } = await supabase
      .from('payments')
      .insert({
        id: paymentId,
        bookingId: bookingId,
        status: status,
        amount: amount,
        paidAt: paidAt || now,
        createdAt: now,
      })
      .select()
      .single();

    if (error) {
      console.error('Payment creation error:', error);
      throw error;
    }

    // Update booking status if payment is successful
    if (status === 'success') {
      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          status: 'CONFIRMED',
          updatedAt: now,
        })
        .eq('id', bookingId);

      if (updateError) {
        console.error('Booking update error:', updateError);
        throw updateError;
      }
    }

    return NextResponse.json({
      success: true,
      payment: payment,
    });
  } catch (error: any) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment' },
      { status: 500 }
    );
  }
}
