import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      userId,
      patientId,
      labId,
      timeSlotId,
      date, // This is the problematic date string "13/09/2025 11:30"
      status,
      totalAmount,
      selectedTests,
      selectedAddons,
      patientDetails,
      qrCodeData,
    } = await request.json();

    const now = new Date().toISOString();

    console.log("received patient details:", patientDetails);

    // 1. Convert the date string to proper PostgreSQL format
    const convertToPostgresDate = (dateString: string) => {
      try {
        console.log('Original date string:', dateString);

        if (dateString.includes('-') && dateString.includes(':')) {
          return dateString;
        }

        // Handle format "13/09/2025 11:30" (DD/MM/YYYY HH:MM)
        const [datePart, timePart] = dateString.split(' ');
        const [day, month, year] = datePart.split('/');

        // Create proper ISO format: YYYY-MM-DD HH:MM:SS
        const formattedDate = `${year}-${month}-${day} ${timePart}:00`;
        console.log('Formatted date:', formattedDate);

        return formattedDate;
      } catch (error) {
        console.error(
          'Error converting date:',
          error,
          'Date string:',
          dateString
        );
        // Fallback to current date if conversion fails
        return new Date().toISOString().replace('T', ' ').substring(0, 19);
      }
    };

    const formattedDate = date;
    console.log('Final formatted date:', formattedDate);

    // 2. Check if patient exists, if not create it
    // let finalPatientId = patientId;

    // const { data: existingPatient, error: patientCheckError } = await supabase
    //   .from('patients')
    //   .select('id')
    //   .eq('userId', patientId)
    //   .single();

    // if (patientCheckError || !existingPatient) {
    //   // Patient doesn't exist, create a new one
    //   const newPatientId = `PAT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    //   const { data: newPatient, error: createPatientError } = await supabase
    //     .from('patients')
    //     .insert({
    //       id: newPatientId,
    //       userId: patientId,
    //       address: patientDetails.address || '',
    //       firstName: patientDetails.firstName || '',
    //       lastName: patientDetails.lastName || '',
    //       age: patientDetails.age || null,
    //       dateOfBirth: patientDetails.dateOfBirth || null,
    //       gender: patientDetails.gender || '',
    //       latitude: patientDetails.latitude || 0.0,
    //       longitude: patientDetails.longitude || 0.0,
    //       createdAt: now,
    //       updatedAt: now,
    //     })
    //     .select('id')
    //     .single();

    //   if (createPatientError) {
    //     console.error('Create patient error:', createPatientError);
    //     throw createPatientError;
    //   }

    //   finalPatientId = newPatient.id;
    // } else {
    //   finalPatientId = existingPatient.id;
    // }

    let finalPatientId = patientId;

    // 1. If no patientId provided → create a new patient
    if (!finalPatientId) {
      const newPatientId = `PAT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const { data: newPatient, error: createPatientError } = await supabase
        .from('patients')
        .insert({
          id: newPatientId,
          userId: userId, // <-- use actual userId, not patientId
          // email: patientDetails.email || null,
          address: patientDetails.address || '',
          firstName: patientDetails.firstName || '',
          lastName: patientDetails.lastName || '',
          age: patientDetails.age || null,
          dateOfBirth: patientDetails.dob || null,
          phone: patientDetails.phone || '',
          gender: patientDetails.gender || '',
          latitude: patientDetails.latitude || 0.0,
          longitude: patientDetails.longitude || 0.0,
          createdAt: now,
          updatedAt: now,
        })
        .select('id')
        .single();

      if (createPatientError) {
        console.error('Create patient error:', createPatientError);
        throw createPatientError;
      }

      finalPatientId = newPatient.id;
    }

    // 3. Create the booking record with properly formatted date
    const bookingId = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        id: bookingId,
        bookingId: bookingId,
        patientId: finalPatientId,
        labId: labId,
        timeSlotId: timeSlotId,
        date: formattedDate, // Use the properly formatted date
        status: status || 'PENDING',
        totalAmount: totalAmount,
        qrCodeData: qrCodeData,
        createdAt: now,
        updatedAt: now,
      })
      .select()
      .single();

    if (bookingError) {
      console.error('Booking error:', bookingError);
      throw bookingError;
    }

    // 4. Create booking_tests records
    if (selectedTests && selectedTests.length > 0) {
      const testRecords = await Promise.all(
        selectedTests.map(async (testName: string) => {
          // Check if test exists
          const { data: existingTest } = await supabase
            .from('tests')
            .select('id')
            .eq('name', testName)
            .single();

          let testId = existingTest?.id;

          if (!existingTest) {
            // Create test if it doesn't exist
            const newTestId = `TEST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const { data: newTest } = await supabase
              .from('tests')
              .insert({
                id: newTestId,
                name: testName,
                category: 'General',
                description: `${testName} test`,
                price: 500,
                isActive: true,
                createdAt: now,
                updatedAt: now,
              })
              .select('id')
              .single();

            testId = newTest?.id || newTestId;
          }

          return {
            id: `BT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            bookingId: bookingId,
            testId: testId || testName,
            createdAt: now,
          };
        })
      );

      const { error: testsError } = await supabase
        .from('booking_tests')
        .insert(testRecords);

      if (testsError) {
        console.error('Tests error:', testsError);
        throw testsError;
      }
    }

    // 5. Create booking_addons records
    if (selectedAddons && selectedAddons.length > 0) {
      const addonRecords = await Promise.all(
        selectedAddons.map(async (addonName: string) => {
          // Check if addon exists
          const { data: existingAddon } = await supabase
            .from('addons')
            .select('id')
            .eq('name', addonName)
            .single();

          let addonId = existingAddon?.id;

          if (!existingAddon) {
            // Create addon if it doesn't exist
            const newAddonId = `ADDON-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            let price = 200;
            if (addonName === 'Express Delivery') price = 500;
            if (addonName === 'Superfast Delivery') price = 350;

            const { data: newAddon } = await supabase
              .from('addons')
              .insert({
                id: newAddonId,
                name: addonName,
                description: `${addonName} service`,
                price: price,
                isActive: true,
                createdAt: now,
                updatedAt: now,
              })
              .select('id')
              .single();

            addonId = newAddon?.id || newAddonId;
          }

          return {
            id: `BA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            bookingId: bookingId,
            addonId: addonId || addonName,
            createdAt: now,
          };
        })
      );

      const { error: addonsError } = await supabase
        .from('booking_addons')
        .insert(addonRecords);

      if (addonsError) {
        console.error('Addons error:', addonsError);
        throw addonsError;
      }
    }

    return NextResponse.json({
      success: true,
      bookingId: bookingId,
      booking: booking,
    });
  } catch (error: any) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create booking' },
      { status: 500 }
    );
  }
}
