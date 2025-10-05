import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const labId = searchParams.get('labId');
    const month = searchParams.get('month'); // YYYY-MM format
    const date = searchParams.get('date'); // Specific date
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const year = searchParams.get('year'); // YYYY format

    if (!labId) {
      return NextResponse.json(
        { error: 'Lab ID is required' },
        { status: 400 }
      );
    }

    let query = supabase.from('attendances').select('*').eq('labId', labId);

    if (employeeId) {
      query = query.eq('employeeId', employeeId);
    }

    if (date) {
      query = query.eq('date', date);
    }

    if (month) {
      const startDate = `${month}-01`;
      const endDate = `${month}-31`;
      query = query.gte('date', startDate).lte('date', endDate);
    }

    if (startDate && endDate) {
      query = query.gte('date', startDate).lte('date', endDate);
    }

    if (year) {
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;
      query = query.gte('date', startDate).lte('date', endDate);
    }

    const { data: attendances, error } = await query.order('date', {
      ascending: false,
    });

    if (error) throw error;

    return NextResponse.json({ success: true, attendances });
  } catch (error: any) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch attendance' },
      { status: 500 }
    );
  }
}
