// app/api/reagents/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { v4 as uuid } from "uuid";

// export async function POST(req: NextRequest) {
//   try {
//     const { id, name, category, description, manufacturer, unit } = await req.json();

//     if (!name || !unit) {
//       return NextResponse.json({ error: "name and unit are required" }, { status: 400 });
//     }

//     const reagent = await db.reagentCatalog.upsert({
//       where: id ? { id } : { id: id ?? "" }, // if id provided, try upsert on id
//       update: {
//         name,
//         category,
//         description,
//         manufacturer,
//         unit,
//         updatedAt: new Date(),
//       },
//       create: {
//         id: id ?? uuid(),
//         name,
//         category,
//         description,
//         manufacturer,
//         unit,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//     });

//     return NextResponse.json(reagent, { status: 201 });
//   } catch (err) {
//     console.error("Error creating reagent:", err);
//     return NextResponse.json({ error: "Failed to create reagent" }, { status: 500 });
//   }
// }

export async function POST(req: NextRequest) {
  try {
    const { id, name, category, description, manufacturer, unit, addToAllLabs = false } = await req.json();

    if (!name || !unit) {
      return NextResponse.json({ error: "name and unit are required" }, { status: 400 });
    }

    const result = await db.$transaction(async (tx) => {
      // Create or update reagent catalog
      const reagent = await tx.reagentCatalog.upsert({
        where: { id: id ?? "" },
        update: {
          name,
          category,
          description,
          manufacturer,
          unit,
          updatedAt: new Date(),
        },
        create: {
          id: id ?? uuid(),
          name,
          category,
          description,
          manufacturer,
          unit,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Optionally add to all labs' inventory (for admin functionality)
      if (addToAllLabs) {
        const allLabs = await tx.lab.findMany();
        for (const lab of allLabs) {
          await tx.lab_inventory.upsert({
            where: {
              labId_reagentId: { labId: lab.id, reagentId: reagent.id }
            },
            update: {
              unit: reagent.unit,
              updatedAt: new Date(),
            },
            create: {
              id: uuid(),
              labId: lab.id,
              reagentId: reagent.id,
              quantity: 0, // Start with zero quantity
              unit: reagent.unit,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });
        }
      }

      return reagent;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error("Error creating reagent:", err);
    return NextResponse.json(
      { error: "Failed to create reagent", details: (err as Error).message }, 
      { status: 500 }
    );
  }
}

// GET - Get all reagents with usage info
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const labId = searchParams.get("labId");

    const reagents = await db.reagentCatalog.findMany({
      include: {
        lab_inventory: labId ? {
          where: { labId }
        } : false,
        TestReagent: {
          include: {
            tests: true
          }
        },
        _count: {
          select: {
            TestReagent: true,
            lab_inventory: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(reagents);
  } catch (err) {
    console.error("Error fetching reagents:", err);
    return NextResponse.json(
      { error: "Failed to fetch reagents" },
      { status: 500 }
    );
  }
}