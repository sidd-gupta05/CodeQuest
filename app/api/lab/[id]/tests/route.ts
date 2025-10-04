<<<<<<< HEAD
// // app/api/lab/[id]/tests/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { db } from '@/lib/prisma';
// import { v4 as uuid } from 'uuid';

// export async function POST(
//   req: NextRequest,
//   context: { params: { id: string } }
// ) {
//   try {
//     const { id: labId } = await context.params;
//     const { name, category, duration, description, reagents, price } = await req.json();

//     // Validate required fields
//     if (!name || !category || price === undefined) {
//       return NextResponse.json(
//         { error: "Name, category, and price are required" },
//         { status: 400 }
//       );
//     }

//     // Validate lab exists
//     const lab = await db.lab.findUnique({
//       where: { id: labId }
//     });

//     if (!lab) {
//       return NextResponse.json(
//         { error: "Lab not found" },
//         { status: 404 }
//       );
//     }

//     // Use transaction to ensure both operations succeed or fail together
//     const result = await db.$transaction(async (tx) => {
//       // Create test
//       const test = await tx.tests.upsert({
//         where: { name }, // Using id as unique identifier
//         update: {
//           category,
//           duration,
//           description,
//           isActive: true, // Ensure it's active when updated
//           updatedAt: new Date(),
//         },
//         create: {
//           id: uuid(),
//           name,
//           category,
//           duration,
//           description,
//           price,
//           isActive: true,
//           labs: {
//             connect: { id: labId }
//           },
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//       });

//       // Handle reagents & custom reagents association
//       if (reagents && reagents.length > 0) {
//         // Delete existing reagents for this test
//         await tx.testReagent.deleteMany({
//           where: { testId: test.id }
//         });

//         const reagentPromises = reagents.map((reagent: any) =>
//           tx.testReagent.create({
//             data: {
//               id: uuid(),
//               testId: test.id,
//               reagentId: reagent.reagentId,
//               quantityPerTest: reagent.quantityPerTest,
//               unit: reagent.unit,
//               createdAt: new Date(),
//               updatedAt: new Date(),
//             },
//           })
//         );

//         await Promise.all(reagentPromises);
//       }

//       return test;
//     });

//     return NextResponse.json(result, { status: 201 });
//   } catch (err) {
//     console.error("Error creating test:", err);

//     // Handle specific Prisma errors
//     if (err instanceof Error) {
//       if (err.message.includes('Unique constraint')) {
//         return NextResponse.json(
//           { error: "A test with this name already exists" },
//           { status: 409 }
//         );
//       }
//     }

//     return NextResponse.json(
//       { error: "Failed to create test" },
//       { status: 500 }
//     );
//   }
// }
// // GET - Get all tests for a lab
// export async function GET(
//   req: NextRequest,
//   context: { params: { id: string } }
// ) {
//   try {
//     const { id: labId } = await context.params;

//     const tests = await db.tests.findMany({
//       where: {
//         labs: {
//           some: {
//             id: labId
//           }
//         }
//       },
//       include: {
//         TestReagent: {
//           include: {
//             ReagentCatalog: true
//           }
//         }
//       },
//       orderBy: {
//         createdAt: 'desc'
//       }
//     });

//     return NextResponse.json(tests);
//   } catch (err) {
//     console.error("Error fetching tests:", err);
//     return NextResponse.json(
//       { error: "Failed to fetch tests" },
//       { status: 500 }
//     );
//   }
// }

=======
>>>>>>> a9d48ee (misc)
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { v4 as uuid } from 'uuid';

export async function POST(
<<<<<<< HEAD
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id: labId } = await context.params;
    const { name, category, duration, description, reagents, price } =
      await req.json();

    // Validate required fields
    if (!name || !category || price === undefined) {
      return NextResponse.json(
        { error: 'Name, category, and price are required' },
=======
  req: NextRequest
) {
  try {
;
    const { labId, name, category, duration, description, reagents, price } = await req.json();

    // Validate required fields
    if (!name || !category) {
      return NextResponse.json(
        { error: "Name and category are required" },
>>>>>>> a9d48ee (misc)
        { status: 400 }
      );
    }

    // Validate lab exists
    const lab = await db.lab.findUnique({
<<<<<<< HEAD
      where: { id: labId },
    });

    if (!lab) {
      return NextResponse.json({ error: 'Lab not found' }, { status: 404 });
=======
      where: { id: labId }
    });

    if (!lab) {
      return NextResponse.json(
        { error: "Lab not found" },
        { status: 404 }
      );
>>>>>>> a9d48ee (misc)
    }

    // Use transaction to ensure both operations succeed or fail together
    const result = await db.$transaction(async (tx) => {
<<<<<<< HEAD
      // Create test
      const test = await tx.tests.upsert({
        where: { name }, // Using name as unique identifier for upsert
=======
      // Create or update test (upsert)
      const test = await tx.tests.upsert({
        where: { name }, // Using id as unique identifier
>>>>>>> a9d48ee (misc)
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
<<<<<<< HEAD
            connect: { id: labId },
=======
            connect: { id: labId }
>>>>>>> a9d48ee (misc)
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

<<<<<<< HEAD
      // Handle reagents & custom reagents association
      if (reagents && reagents.length > 0) {
        // Delete existing reagents for this test
        await tx.testReagent.deleteMany({
          where: { testId: test.id },
        });

        const reagentPromises = reagents.map((reagent: any) =>
          tx.testReagent.create({
=======
      // Handle reagents - delete existing and create new ones
      if (reagents && reagents.length > 0) {
        // Delete existing reagents for this test
        await tx.testReagent.deleteMany({
          where: { testId: test.id }
        });

        // Create new reagents
        for (const reagent of reagents) {
          await tx.testReagent.create({
>>>>>>> a9d48ee (misc)
            data: {
              id: uuid(),
              testId: test.id,
              reagentId: reagent.reagentId,
              quantityPerTest: reagent.quantityPerTest,
              unit: reagent.unit,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
<<<<<<< HEAD
          })
        );

        await Promise.all(reagentPromises);
=======
          });
        }
>>>>>>> a9d48ee (misc)
      }

      return test;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
<<<<<<< HEAD
    console.error('Error creating test:', err);

=======
    console.error("Error creating test:", err);
    
>>>>>>> a9d48ee (misc)
    // Handle specific Prisma errors
    if (err instanceof Error) {
      if (err.message.includes('Unique constraint')) {
        return NextResponse.json(
<<<<<<< HEAD
          { error: 'A test with this name already exists' },
=======
          { error: "A test with this name already exists" },
>>>>>>> a9d48ee (misc)
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
<<<<<<< HEAD
      { error: 'Failed to create test' },
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
            id: labId,
          },
        },
      },
      include: {
        TestReagent: {
          include: {
            ReagentCatalog: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(tests);
  } catch (err) {
    console.error('Error fetching tests:', err);
    return NextResponse.json(
      { error: 'Failed to fetch tests' },
      { status: 500 }
    );
  }
}
=======
      { error: "Failed to create test" },
      { status: 500 }
    );
  }
}
>>>>>>> a9d48ee (misc)
