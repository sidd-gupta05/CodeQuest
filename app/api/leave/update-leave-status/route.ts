//app/api/leave/update-leave-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { leaveId, status, notes } = await request.json();

    console.log('Update leave status request:', { leaveId, status, notes });

    if (!leaveId || !status) {
      return NextResponse.json(
        { error: 'Leave ID and status are required' },
        { status: 400 }
      );
    }

    const updateData: any = {
      status,
      updatedAt: new Date().toISOString(),
    };

    if (notes) {
      updateData.notes = notes;
    }

    // In a real application, you might want to set approvedBy to the current user
    // const { data: { user } } = await supabase.auth.getUser();
    // if (user) {
    //   updateData.approvedBy = user.id;
    // }

    const { data: leave, error } = await supabase
      .from('leave_applications')
      .update(updateData)
      .eq('id', leaveId)
      .select(
        `
        *,
        employee:employeeId (name, role, department)
      `
      )
      .single();

    if (error) {
      console.error('Error updating leave status:', error);
      throw error;
    }

    console.log('Successfully updated leave status:', leave);
    return NextResponse.json({ success: true, leave });
  } catch (error: any) {
    console.error('Error in update-leave-status API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update leave status' },
      { status: 500 }
    );
  }
}
