//app/api/leave/apply-leave/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const labId = searchParams.get('labId');
    const status = searchParams.get('status');

    if (!labId) {
      return NextResponse.json(
        { error: 'Lab ID is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('leave_applications')
      .select(
        `
        *,
        employee:employeeId (name, role, department)
      `
      )
      .eq('labId', labId);

    if (employeeId) {
      query = query.eq('employeeId', employeeId);
    }

    if (status && status !== 'ALL') {
      query = query.eq('status', status);
    }

    const { data: leaves, error } = await query.order('createdAt', {
      ascending: false,
    });

    if (error) throw error;

    return NextResponse.json({ success: true, leaves });
  } catch (error: any) {
    console.error('Error fetching leaves:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch leave applications' },
      { status: 500 }
    );
  }
}
