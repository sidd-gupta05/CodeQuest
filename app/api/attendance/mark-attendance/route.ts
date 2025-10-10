// app/api/attendance/mark-attendance/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

// Helper function to get current India time in ISO format (with IST offset applied)
function getIndiaTimeISOString() {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const indiaTime = new Date(now.getTime() + istOffset);

  // Format manually to include IST offset (not UTC)
  const isoString = indiaTime.toISOString().replace('Z', '+05:30');
  return isoString;
}

// Helper function to format date for India timezone (YYYY-MM-DD)
function getIndiaDateString() {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const indiaTime = new Date(now.getTime() + istOffset);
  const indiaDate = indiaTime.toISOString().split('T')[0];
  return indiaDate;
}

// Helper function to calculate hours between two timestamps
function calculateTotalHours(checkIn: string, checkOut: string): number {
  try {
    // Parse both dates as they are (already in IST timezone)
    const checkInTime = new Date(checkIn).getTime();
    const checkOutTime = new Date(checkOut).getTime();

    // Calculate difference in milliseconds
    const diffMs = checkOutTime - checkInTime;

    // Convert to hours
    const totalHours = diffMs / (1000 * 60 * 60);

    // Return rounded to 2 decimal places, ensure it's not negative
    return Math.max(0, parseFloat(totalHours.toFixed(2)));
  } catch (error) {
    console.error('Error calculating total hours:', error);
    return 0;
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { employeeId, labId, date, checkIn, checkOut, status, notes } =
      await request.json();

    if (!employeeId || !labId || !date) {
      return NextResponse.json(
        { error: 'Employee ID, Lab ID and Date are required' },
        { status: 400 }
      );
    }

    // Generate UUID for the attendance record
    const { v4: uuidv4 } = await import('uuid');
    const attendanceId = uuidv4();

    // Use India time
    const now = getIndiaTimeISOString();
    const today = date || getIndiaDateString();

    // Check if attendance already exists for this employee on this date
    const { data: existingAttendance, error: fetchError } = await supabase
      .from('attendances')
      .select('*')
      .eq('employeeId', employeeId)
      .eq('date', today)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 is "not found" error
      throw fetchError;
    }

    if (existingAttendance) {
      // Update existing attendance
      const updateData: any = {
        updatedAt: now,
      };

      if (checkIn) updateData.checkIn = checkIn;
      if (checkOut) updateData.checkOut = checkOut;
      if (status) updateData.status = status;
      if (notes !== undefined) updateData.notes = notes;

      // Calculate total hours if both checkIn and checkOut are present
      if (checkIn && checkOut) {
        updateData.totalHours = calculateTotalHours(checkIn, checkOut);
      } else if (checkIn && !checkOut && existingAttendance.checkOut) {
        // If only checkIn is being updated but checkOut exists, recalculate
        updateData.totalHours = calculateTotalHours(
          checkIn,
          existingAttendance.checkOut
        );
      } else if (!checkIn && checkOut && existingAttendance.checkIn) {
        // If only checkOut is being updated but checkIn exists, recalculate
        updateData.totalHours = calculateTotalHours(
          existingAttendance.checkIn,
          checkOut
        );
      } else if (checkIn && existingAttendance.checkOut) {
        // If checkIn is updated and checkOut already exists
        updateData.totalHours = calculateTotalHours(
          checkIn,
          existingAttendance.checkOut
        );
      } else if (existingAttendance.checkIn && checkOut) {
        // If checkOut is updated and checkIn already exists
        updateData.totalHours = calculateTotalHours(
          existingAttendance.checkIn,
          checkOut
        );
      }

      const { data: attendance, error } = await supabase
        .from('attendances')
        .update(updateData)
        .eq('id', existingAttendance.id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({
        success: true,
        attendance,
        action: 'updated',
      });
    } else {
      // Create new attendance
      const insertData: any = {
        id: attendanceId,
        employeeId,
        labId,
        date: today,
        status: status || 'PRESENT',
        createdAt: now,
        updatedAt: now,
      };

      if (checkIn) insertData.checkIn = checkIn;
      if (checkOut) insertData.checkOut = checkOut;
      if (notes) insertData.notes = notes;

      // Calculate total hours if both checkIn and checkOut are provided
      if (checkIn && checkOut) {
        insertData.totalHours = calculateTotalHours(checkIn, checkOut);
      }

      const { data: attendance, error } = await supabase
        .from('attendances')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({
        success: true,
        attendance,
        action: 'created',
      });
    }
  } catch (error: any) {
    console.error('Error marking attendance:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to mark attendance' },
      { status: 500 }
    );
  }
}
