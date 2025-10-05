import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

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

    const now = new Date().toISOString();

    // Check if attendance already exists for this employee on this date
    const { data: existingAttendance, error: fetchError } = await supabase
      .from('attendances')
      .select('*')
      .eq('employeeId', employeeId)
      .eq('date', date)
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
        const checkInTime = new Date(checkIn).getTime();
        const checkOutTime = new Date(checkOut).getTime();
        const totalHours = (checkOutTime - checkInTime) / (1000 * 60 * 60); // Convert ms to hours
        updateData.totalHours = parseFloat(totalHours.toFixed(2));
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
        date,
        status: status || 'PRESENT',
        createdAt: now,
        updatedAt: now,
      };

      if (checkIn) insertData.checkIn = checkIn;
      if (checkOut) insertData.checkOut = checkOut;
      if (notes) insertData.notes = notes;

      // Calculate total hours if both checkIn and checkOut are provided
      if (checkIn && checkOut) {
        const checkInTime = new Date(checkIn).getTime();
        const checkOutTime = new Date(checkOut).getTime();
        const totalHours = (checkOutTime - checkInTime) / (1000 * 60 * 60);
        insertData.totalHours = parseFloat(totalHours.toFixed(2));
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
