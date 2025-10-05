// app/api/bookings/update-report-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { bookingId, reportStatus, allocatedEmployee } = await request.json();

    if (!bookingId || !reportStatus) {
      return NextResponse.json(
        { error: 'Booking ID and Report Status are required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('bookings')
      .update({ reportStatus, allocatedEmpId: allocatedEmployee || null })
      .eq('id', bookingId);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update report status' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Report status updated successfully' });
  } catch (error) {
    console.error('Error updating report status:', error);
  }
}
