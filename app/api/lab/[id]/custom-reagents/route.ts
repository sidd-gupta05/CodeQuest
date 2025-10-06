// app/api/lab/[labId]/custom-reagents/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { v4 as uuid } from "uuid";

// export async function POST(req: NextRequest, 
//   context: { params: { id: string } }) {
//   try {
//     const body = await req.json();
//     const { id: labId } = await context.params;
//     if (!labId) return NextResponse.json({ error: "labId required" }, { status: 400 });

//     const { name, description, quantity, unit, expiryDate, reorderThreshold, manufacturer, category } = body;

//     if (!name || !unit) {
//       return NextResponse.json({ error: "name and unit required" }, { status: 400 });
//     }

//     const created = await db.customReagent.create({
//       data: {
//         id: uuid(),
//         labId,
//         name,
//         category: category ?? null,
//         description: description ?? null,
//         manufacturer: manufacturer ?? null,
//         unit,
//         expiryDate: expiryDate ? new Date(expiryDate) : null,
//         quantity: typeof quantity === "number" ? quantity : 0,
//         reorderThreshold: typeof reorderThreshold === "number" ? reorderThreshold : null,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       },
//     });

//     return NextResponse.json(created, { status: 201 });
//   } catch (err) {
//     console.error("Error creating custom reagent:", err);
//     return NextResponse.json({ error: "Failed to create custom reagent" }, { status: 500 });
//   }
// }

export async function POST(
  req: NextRequest, 
  context: { params: { id: string } }
) {
  try {
    const { id: labId } = await context.params;
    const body = await req.json();
    
    const { name, description, quantity, unit, expiryDate, reorderThreshold, manufacturer, category, addToInventory = false } = body;

    if (!name || !unit) {
      return NextResponse.json({ error: "name and unit required" }, { status: 400 });
    }

    const result = await db.$transaction(async (tx) => {
      // Create custom reagent
      const customReagent = await tx.customReagent.create({
        data: {
          id: uuid(),
          labId,
          name,
          category: category ?? null,
          description: description ?? null,
          manufacturer: manufacturer ?? null,
          unit,
          expiryDate: expiryDate ? new Date(expiryDate) : null,
          quantity: typeof quantity === "number" ? quantity : 0,
          reorderThreshold: typeof reorderThreshold === "number" ? reorderThreshold : null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Optionally add to inventory
      if (addToInventory && quantity > 0) {
        await tx.lab_inventory.create({
          data: {
            id: uuid(),
            labId,
            customReagentId: customReagent.id,
            quantity,
            unit,
            expiryDate: expiryDate ? new Date(expiryDate) : null,
            reorderThreshold: typeof reorderThreshold === "number" ? reorderThreshold : null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }

      return customReagent;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error("Error creating custom reagent:", err);
    return NextResponse.json(
      { error: "Failed to create custom reagent", details: (err as Error).message }, 
      { status: 500 }
    );
  }
}

// GET - Get custom reagents with inventory status
export async function GET(
  req: NextRequest,
  { params }: { params: { labId: string } }
) {
  try {
    const { labId } = params;

    const customReagents = await db.customReagent.findMany({
      where: { labId },
      include: {
        lab_inventory: true // Include inventory status
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(customReagents);
  } catch (err) {
    console.error("Error fetching custom reagents:", err);
    return NextResponse.json(
      { error: "Failed to fetch custom reagents" },
      { status: 500 }
    );
  }
}