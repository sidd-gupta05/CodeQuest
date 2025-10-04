// app/api/lab/[labId]/inventory/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { v4 as uuid } from "uuid";

type Body = {
  reagentId?: string;
  customReagentId?: string;
  quantity: number;
  unit?: string;
  expiryDate?: string | null;
  reorderThreshold?: number | null;
  batchNumber?: string | null;
  increment?: boolean;
};

// export async function POST(req: NextRequest, { params }: { params?: { id?: string } }) {
//   try {
//     const body = (await req.json()) as Body;
//     const labId = params?.id ?? body.labId;
//     if (!labId) return NextResponse.json({ error: "labId required" }, { status: 400 });

//     const { reagentId, quantity, unit = "unit", expiryDate = null, reorderThreshold = null, batchNumber = null, increment = true } = body;

//     if (!reagentId || typeof quantity !== "number") {
//       return NextResponse.json({ error: "reagentId and numeric quantity are required" }, { status: 400 });
//     }

//     // Ensure reagent exists
//     const reagent = await db.reagentCatalog.findUnique({ where: { id: reagentId } });
//     if (!reagent) {
//       return NextResponse.json({ error: "Reagent not found in ReagentCatalog. Create reagent first." }, { status: 404 });
//     }

//     // Upsert inventory row
//     const existing = await db.lab_inventory.findUnique({
//       where: { labId_reagentId: { labId, reagentId } },
//     });

//     if (existing) {
//       const updated = await db.lab_inventory.update({
//         where: { labId_reagentId: { labId, reagentId } },
//         data: {
//           quantity: increment ? { increment: quantity } : quantity,
//           unit,
//           expiryDate: expiryDate ? new Date(expiryDate) : null,
//           reorderThreshold,
//           batchNumber,
//           updatedAt: new Date(),
//         },
//       });
//       return NextResponse.json(updated);
//     } else {
//       const created = await db.lab_inventory.create({
//         data: {
//           id: uuid(),
//           labId,
//           reagentId,
//           quantity,
//           unit,
//           expiryDate: expiryDate ? new Date(expiryDate) : null,
//           reorderThreshold,
//           batchNumber,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//       });
//       return NextResponse.json(created, { status: 201 });
//     }
//   } catch (err) {
//     console.error("Error stocking inventory:", err);
//     return NextResponse.json({ error: "Failed to stock inventory", details: (err as any).message }, { status: 500 });
//   }
// }


export async function POST(
  req: NextRequest, 
  { params }: { params: { labId: string } }
) {
  try {
    const { labId } = params;
    const body: Body = await req.json();

    const { 
      reagentId, 
      customReagentId, 
      quantity, 
      unit = "unit", 
      expiryDate = null, 
      reorderThreshold = null, 
      batchNumber = null, 
      increment = true 
    } = body;

    // Validate that only one reagent type is provided
    if (!reagentId && !customReagentId) {
      return NextResponse.json(
        { error: "Either reagentId or customReagentId is required" }, 
        { status: 400 }
      );
    }

    if (reagentId && customReagentId) {
      return NextResponse.json(
        { error: "Provide either reagentId OR customReagentId, not both" }, 
        { status: 400 }
      );
    }

    if (typeof quantity !== "number") {
      return NextResponse.json(
        { error: "Numeric quantity is required" }, 
        { status: 400 }
      );
    }

    // Check if lab exists
    const lab = await db.lab.findUnique({ where: { id: labId } });
    if (!lab) {
      return NextResponse.json({ error: "Lab not found" }, { status: 404 });
    }

    let existing;
    let created;

    if (reagentId) {
      // Handle regular reagent catalog item
      const reagent = await db.reagentCatalog.findUnique({ where: { id: reagentId } });
      if (!reagent) {
        return NextResponse.json(
          { error: "Reagent not found in ReagentCatalog" }, 
          { status: 404 }
        );
      }

      existing = await db.lab_inventory.findUnique({
        where: { labId_reagentId: { labId, reagentId } },
      });

      if (existing) {
        created = await db.lab_inventory.update({
          where: { labId_reagentId: { labId, reagentId } },
          data: {
            quantity: increment ? { increment: quantity } : quantity,
            unit,
            expiryDate: expiryDate ? new Date(expiryDate) : null,
            reorderThreshold,
            batchNumber,
            updatedAt: new Date(),
          },
        });
      } else {
        created = await db.lab_inventory.create({
          data: {
            id: uuid(),
            labId,
            reagentId,
            quantity,
            unit,
            expiryDate: expiryDate ? new Date(expiryDate) : null,
            reorderThreshold,
            batchNumber,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }
    } else if (customReagentId) {
      // Handle custom reagent
      const customReagent = await db.customReagent.findUnique({ 
        where: { id: customReagentId } 
      });
      if (!customReagent) {
        return NextResponse.json(
          { error: "Custom reagent not found" }, 
          { status: 404 }
        );
      }

      // Verify custom reagent belongs to this lab
      if (customReagent.labId !== labId) {
        return NextResponse.json(
          { error: "Custom reagent does not belong to this lab" }, 
          { status: 403 }
        );
      }

      existing = await db.lab_inventory.findFirst({
        where: { labId, customReagentId },
      });

      if (existing) {
        created = await db.lab_inventory.update({
          where: { id: existing.id },
          data: {
            quantity: increment ? { increment: quantity } : quantity,
            unit,
            expiryDate: expiryDate ? new Date(expiryDate) : null,
            reorderThreshold,
            batchNumber,
            updatedAt: new Date(),
          },
        });
      } else {
        created = await db.lab_inventory.create({
          data: {
            id: uuid(),
            labId,
            customReagentId,
            quantity,
            unit,
            expiryDate: expiryDate ? new Date(expiryDate) : null,
            reorderThreshold,
            batchNumber,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }
    }

    return NextResponse.json(created, { status: existing ? 200 : 201 });
  } catch (err) {
    console.error("Error stocking inventory:", err);
    return NextResponse.json(
      { error: "Failed to stock inventory", details: (err as Error).message }, 
      { status: 500 }
    );
  }
}

// GET - Get inventory with both reagent types
export async function GET(
  req: NextRequest,
  { params }: { params: { labId: string } }
) {
  try {
    const { labId } = params;

    const inventory = await db.lab_inventory.findMany({
      where: { labId },
      include: {
        ReagentCatalog: true,
        CustomReagent: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(inventory);
  } catch (err) {
    console.error("Error fetching inventory:", err);
    return NextResponse.json(
      { error: "Failed to fetch inventory" },
      { status: 500 }
    );
  }
}