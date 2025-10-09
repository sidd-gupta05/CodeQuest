// app/api/leave/apply-leave/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { employeeId, labId, startDate, endDate, leaveType, reason } =
      await request.json();

    console.log('Apply leave request:', {
      employeeId,
      labId,
      startDate,
      endDate,
      leaveType,
      reason,
    });

    if (
      !employeeId ||
      !labId ||
      !startDate ||
      !endDate ||
      !leaveType ||
      !reason
    ) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const { v4: uuidv4 } = require('uuid');
    const leaveId = uuidv4();

    const now = new Date().toISOString();

    const { data: leaveApplication, error } = await supabase
      .from('leave_applications')
      .insert({
        id: leaveId,
        employeeId,
        labId,
        startDate,
        endDate,
        leaveType,
        reason,
        status: 'PENDING',
        createdAt: now,
        updatedAt: now,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating leave application:', error);
      throw error;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    for (
      let date = new Date(start);
      date <= end;
      date.setDate(date.getDate() + 1)
    ) {
      const dateString = date.toISOString().split('T')[0];

      const { data: existingAttendance } = await supabase
        .from('attendances')
        .select('*')
        .eq('employeeId', employeeId)
        .eq('date', dateString)
        .single();

      if (!existingAttendance) {
        const attendanceId = uuidv4();
        await supabase.from('attendances').insert({
          id: attendanceId,
          employeeId,
          labId,
          date: dateString,
          status: 'LEAVE',
          notes: `On leave: ${leaveType}`,
          createdAt: now,
          updatedAt: now,
        });
      } else {
        await supabase
          .from('attendances')
          .update({
            status: 'LEAVE',
            notes: `On leave: ${leaveType}`,
            updatedAt: now,
          })
          .eq('id', existingAttendance.id);
      }
    }

    console.log('Successfully created leave application:', leaveApplication);
    return NextResponse.json({ success: true, leaveApplication });
  } catch (error: any) {
    console.error('Error in apply-leave API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to apply for leave' },
      { status: 500 }
    );
  }
}
