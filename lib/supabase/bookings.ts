import { createSupabaseServerClient } from './server';

export async function getPatientBookings(patientId: string) {
  const supabase = createSupabaseServerClient();

  const { data: bookings, error } = await (await supabase)
    .from('bookings')
    .select(
      `
      *,
      labs:labId (*),
      payments (*),
      booking_tests (tests (*)),
      booking_addons (addons (*))
    `
    )
    .eq('patientId', patientId)
    .order('createdAt', { ascending: false });

  if (error) throw error;
  return bookings;
}

export async function getBookingById(bookingId: string) {
  const supabase = createSupabaseServerClient();

  const { data: booking, error } = await (await supabase)
    .from('bookings')
    .select(
      `
      *,
      labs:labId (*, lab_details (*)),
      patients:patientId (*, user:userId (*)),
      payments (*),
      booking_tests (tests (*)),
      booking_addons (addons (*)),
      lab_time_slots:timeSlotId (*)
    `
    )
    .eq('id', bookingId)
    .single();

  if (error) throw error;
  return booking;
}
