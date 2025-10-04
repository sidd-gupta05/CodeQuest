import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { v4 as uuid } from 'uuid';

export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id: labId } = await context.params;
    const { name, category, duration, description, reagents, price } = await req.json();

    // Validate required fields
    if (!name || !category || price === undefined) {
      return NextResponse.json(
        { error: "Name, category, and price are required" },
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
      // Create test
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

      // Handle reagents & custom reagents association
      if (reagents && reagents.length > 0) {
        // Delete existing reagents for this test
        await tx.testReagent.deleteMany({
          where: { testId: test.id }
        });

        const reagentPromises = reagents.map((reagent: any) => 
          tx.testReagent.create({
            data: {
              id: uuid(),
              testId: test.id,
              reagentId: reagent.reagentId,
              quantityPerTest: reagent.quantityPerTest,
              unit: reagent.unit,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          })
        );

        await Promise.all(reagentPromises);
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
// GET - Get all tests for a lab
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id: labId } = await context.params;

    const tests = await db.tests.findMany({
      where: {
        labs: {
          some: {
            id: labId
          }
        }
      },
      include: {
        TestReagent: {
          include: {
            ReagentCatalog: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(tests);
  } catch (err) {
    console.error("Error fetching tests:", err);
    return NextResponse.json(
      { error: "Failed to fetch tests" },
      { status: 500 }
    );
  }
}