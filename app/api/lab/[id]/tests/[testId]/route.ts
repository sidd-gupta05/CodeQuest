// app/api/lab/[labId]/tests/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { v4 as uuid } from 'uuid';

export async function POST(
  req: NextRequest,
  { params }: { params: { labId: string } }
) {
  try {
    const { labId } = params;
    const body = await req.json();

    const { name, category, duration, description, price, reagents } = body;

    console.log('Creating test with data:', {
      labId,
      name,
      category,
      reagents,
    });

    // Validate required fields
    if (
      !name ||
      !category ||
      price === undefined ||
      !reagents ||
      reagents.length === 0
    ) {
      return NextResponse.json(
        {
          error: 'Name, category, price, and at least one reagent are required',
        },
        { status: 400 }
      );
    }

    // Validate lab exists
    const lab = await db.lab.findUnique({
      where: { id: labId },
    });

    if (!lab) {
      return NextResponse.json({ error: 'Lab not found' }, { status: 404 });
    }

    // Create the test
    const newTest = await db.tests.create({
      data: {
        id: uuid(),
        name,
        category,
        duration,
        description,
        price,
        // include timestamps required by the Prisma type
        createdAt: new Date(),
        updatedAt: new Date(),
        labs: {
          connect: { id: labId },
        },
        TestReagent: {
          create: reagents.map((reagent: any) => ({
            id: uuid(),
            reagentId: reagent.reagentId,
            quantityPerTest: reagent.quantityPerTest,
            unit: reagent.unit,
          })),
        },
      },
      include: {
        TestReagent: {
          include: {
            ReagentCatalog: true,
          },
        },
      },
    });

    console.log('Test created successfully:', newTest.id);

    return NextResponse.json({
      success: true,
      test: newTest,
      message: 'Test created successfully',
    });
  } catch (error: any) {
    console.error('Error creating test:', error);

    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A test with this name already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create test' },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { labId: string } }
) {
  try {
    const { labId } = params;

    const tests = await db.tests.findMany({
      where: {
        labs: {
          some: { id: labId },
        },
      },
      include: {
        TestReagent: {
          include: {
            ReagentCatalog: true,
          },
        },
      },
    });

    return NextResponse.json(tests);
  } catch (error: any) {
    console.error('Error fetching tests:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch tests' },
      { status: 500 }
    );
  }
}
