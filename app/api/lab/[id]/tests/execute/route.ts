import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { v4 as uuid } from 'uuid';

export async function POST(
  req: NextRequest
) {
  try {
;
    const { labId, name, category, duration, description, reagents, price } = await req.json();

    // Validate required fields
    if (!name || !category) {
      return NextResponse.json(
        { error: "Name and category are required" },
        { status: 400 }
      );
    }

    // Validate lab exists
    const lab = await db.lab.findUnique({
      where: { id: labId }
    });

    if (!lab) {
      return NextResponse.json(
        { error: "Lab not found" },
        { status: 404 }
      );
    }

    // Use transaction to ensure both operations succeed or fail together
    const result = await db.$transaction(async (tx) => {
      // Create or update test (upsert)
      const test = await tx.tests.upsert({
        where: { name }, // Using id as unique identifier
        update: {
          category,
          duration,
          description,
          isActive: true, // Ensure it's active when updated
          updatedAt: new Date(),
        },
        create: {
          id: uuid(),
          name,
          category,
          duration,
          description,
          price,
          isActive: true,
          labs: {
            connect: { id: labId }
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Handle reagents - delete existing and create new ones
      if (reagents && reagents.length > 0) {
        // Delete existing reagents for this test
        await tx.testReagent.deleteMany({
          where: { testId: test.id }
        });

        // Create new reagents
        for (const reagent of reagents) {
          await tx.testReagent.create({
            data: {
              id: uuid(),
              testId: test.id,
              reagentId: reagent.reagentId,
              quantityPerTest: reagent.quantityPerTest,
              unit: reagent.unit,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });
        }
      }

      return test;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error("Error creating test:", err);
    
    // Handle specific Prisma errors
    if (err instanceof Error) {
      if (err.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: "A test with this name already exists" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to create test" },
      { status: 500 }
    );
  }
}