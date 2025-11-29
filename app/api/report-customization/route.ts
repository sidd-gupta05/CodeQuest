// app/api/report-customization/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { db } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const lab = await db.lab.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!lab) {
      return NextResponse.json({ error: 'Lab not found' }, { status: 404 });
    }

    try {
      const customization = await db.reportCustomization.findUnique({
        where: { labId: lab.id },
      });

      return NextResponse.json({
        success: true,
        customization: customization || null,
      });
    } catch (error: any) {
      if (error.code === 'P2021') {
        return NextResponse.json({
          success: true,
          customization: null,
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error in GET report customization:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { settings } = body;

    if (!settings) {
      return NextResponse.json(
        { error: 'Settings are required' },
        { status: 400 }
      );
    }

    const lab = await db.lab.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!lab) {
      return NextResponse.json({ error: 'Lab not found' }, { status: 404 });
    }

    try {
      const customization = await db.reportCustomization.upsert({
        where: { labId: lab.id },
        update: {
          settings: settings,
          updatedAt: new Date(),
        },
        create: {
          labId: lab.id,
          settings: settings,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Customization saved successfully',
        customization,
      });
    } catch (error: any) {
      if (error.code === 'P2021') {
        return NextResponse.json(
          {
            error: 'Database table not ready. Please run: npx prisma db push',
          },
          { status: 500 }
        );
      }
      throw error;
    }
  } catch (error: any) {
    console.error('Error saving customization:', error);
    return NextResponse.json(
      {
        error: 'Failed to save customization',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
