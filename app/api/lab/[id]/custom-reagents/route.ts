// app/api/lab/[labId]/custom-reagents/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { v4 as uuid } from "uuid";

export async function POST(req: NextRequest, 
  context: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { id: labId } = await context.params;
    if (!labId) return NextResponse.json({ error: "labId required" }, { status: 400 });

    const { name, description, quantity, unit, expiryDate, reorderThreshold, manufacturer, category } = body;

    if (!name || !unit) {
      return NextResponse.json({ error: "name and unit required" }, { status: 400 });
    }

    const created = await db.customReagent.create({
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

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("Error creating custom reagent:", err);
    return NextResponse.json({ error: "Failed to create custom reagent" }, { status: 500 });
  }
}
