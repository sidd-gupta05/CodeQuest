// /app/api/bookings/get-user-bookings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

// --- TypeScript interfaces ---
interface BookingAddon {
  id: string;
  addonId: string;
}

interface BookingTest {
  id: string;
  testId: string;
}

interface Booking {
  id: string;
  bookingId: string;
  date: string;
  status: string;
  reportStatus: string;
  totalAmount: number;
  createdAt: string;
  booking_addons: BookingAddon[];
  booking_tests: BookingTest[];
  patient: PatientInfo;
  lab: {
    id: string;
    labLocation: string;
    labName: string;
  };
}

interface PatientInfo {
  id: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  gender?: string;
  phone?: string;
}

// --- API Route ---
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required in request body' },
        { status: 400 }
      );
    }

    // Fetch patients and their bookings with labs_with_details view
    const { data, error } = await supabase
      .from('patients')
      .select(
        `
        id,
        firstName,
        lastName,
        age,
        gender,
        phone,
        bookings (
          id,
          bookingId,
          date,
          status,
          reportStatus,
          totalAmount,
          createdAt,
          booking_addons (
            id,
            addonId (name)
          ),
          booking_tests (
            id,
            testId (name)
          ),
          labs_with_details (
            id,
            "labLocation",
            "labName"
          )
        )
      `
      )
      .eq('userId', userId);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch bookings', details: error.message },
        { status: 500 }
      );
    }

    // Map data to Booking[] format
    const allBookings: Booking[] = [];

    data?.forEach((patient: any) => {
      patient.bookings.forEach((booking: any) => {
        allBookings.push({
          id: booking.id,
          bookingId: booking.bookingId,
          date: booking.date,
          status: booking.status,
          reportStatus: booking.reportStatus,
          totalAmount: booking.totalAmount,
          createdAt: booking.createdAt,
          booking_addons: booking.booking_addons ?? [],
          booking_tests: booking.booking_tests ?? [],
          patient: {
            id: patient.id,
            firstName: patient.firstName,
            lastName: patient.lastName,
            age: patient.age,
            gender: patient.gender,
            phone: patient.phone,
          },
          lab: {
            id: booking.labs_with_details?.id ?? '',
            labLocation: booking.labs_with_details?.labLocation ?? '',
            labName: booking.labs_with_details?.labName ?? 'Unknown',
          },
        });
      });
    });

    allBookings.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ bookings: allBookings });
  } catch (err) {
    console.error('Error fetching user bookings:', err);
    return NextResponse.json(
      { error: 'Unexpected server error' },
      { status: 500 }
    );
  }
}
