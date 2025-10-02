// DELETE EMPLOYEE
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { employeeId } = await request.json(); // Get ID from request body

    if (!employeeId) {
      return NextResponse.json(
        { error: 'Employee ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('employee')
      .delete()
      .eq('id', employeeId);

    if (error) {
      console.error('Error deleting employee:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, deleted: data });
  } catch (error: any) {
    console.error('Unexpected error deleting employee:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete employee' },
      { status: 500 }
    );
  }
}
