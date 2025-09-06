import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { userId, patientDetails } = await request.json();

    // Check if patient exists
    const { data: existingPatient, error: patientCheckError } = await supabase
      .from('patients')
      .select('id')
      .eq('userId', userId)
      .single();

    if (patientCheckError || !existingPatient) {
      // Create new patient
      const newPatientId = `PAT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const { data: newPatient, error: createPatientError } = await supabase
        .from('patients')
        .insert({
          id: newPatientId,
          userId: userId,
          address: patientDetails.address || '',
          dateOfBirth: patientDetails.dateOfBirth || null,
          gender: patientDetails.gender || '',
          latitude: patientDetails.latitude || 0.0,
          longitude: patientDetails.longitude || 0.0,
        })
        .select('id')
        .single();

      if (createPatientError) {
        console.error('Create patient error:', createPatientError);
        throw createPatientError;
      }

      return NextResponse.json({
        success: true,
        patientId: newPatient.id,
        isNew: true,
      });
    }

    return NextResponse.json({
      success: true,
      patientId: existingPatient.id,
      isNew: false,
    });
  } catch (error: any) {
    console.error('Error ensuring patient:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to ensure patient' },
      { status: 500 }
    );
  }
}
