// app/api/bookings/update-booking/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { bookingId, qrCodeData, status } = await request.json();

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (qrCodeData) updateData.qrCodeData = qrCodeData;
    if (status) updateData.status = status;
    updateData.updatedAt = new Date().toISOString();

    // First check if the booking exists
    const { data: existingBooking, error: checkError } = await supabase
      .from('bookings')
      .select('id')
      .eq('id', bookingId)
      .single();

    if (checkError || !existingBooking) {
      console.error('Booking not found:', bookingId);
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Update the booking
    const { data: booking, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', bookingId)
      .select()
      .single();

    if (error) {
      console.error('Update booking error:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      booking: booking,
    });
  } catch (error: any) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update booking' },
      { status: 500 }
    );
  }
}
