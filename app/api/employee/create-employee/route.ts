//app/api/employee/create-employee/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    const { labId, name, role, monthlySalary, department, isFieldCollector } = await request.json();

    if (!labId || !name || !role || !monthlySalary || !department || isFieldCollector === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    const employeeId = `EMP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const { data: employee, error } = await supabase
      .from('employee')
      .insert({
        id: employeeId,
        labId,
        name,
        role,
        monthlySalary,
        department,
        isFieldCollector,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating employee:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, employee });
  } catch (error: any) {
    console.error('Unexpected error creating employee:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create employee' },
      { status: 500 }
    );
  }
}
