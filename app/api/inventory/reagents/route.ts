// app/api/reagents/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { v4 as uuid } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const { id, name, category, description, manufacturer, unit } = await req.json();

    if (!name || !unit) {
      return NextResponse.json({ error: "name and unit are required" }, { status: 400 });
    }

    const reagent = await db.reagentCatalog.upsert({
      where: id ? { id } : { id: id ?? "" }, // if id provided, try upsert on id
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

    return NextResponse.json(reagent, { status: 201 });
  } catch (err) {
    console.error("Error creating reagent:", err);
    return NextResponse.json({ error: "Failed to create reagent" }, { status: 500 });
  }
}
