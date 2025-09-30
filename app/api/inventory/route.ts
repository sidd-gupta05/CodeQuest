import { NextResponse } from "next/server";
import { db } from "@/lib/prisma"; // make sure you have db client exported from here

// GET /api/inventory → list all inventory items
export async function GET() {
  try {
    const items = await db.inventoryItem.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ items });
  } catch (err) {
    console.error("Error fetching inventory", err);
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}

// POST /api/inventory → add new inventory item
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, quantity, unit } = body;

    if (!name || !quantity || !unit) {
      return NextResponse.json(
        { error: "Missing fields: name, quantity, unit" },
        { status: 400 }
      );
    }

    const item = await db.inventoryItem.create({
      data: { name, quantity, unit },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    console.error("Error creating inventory item", err);
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}
