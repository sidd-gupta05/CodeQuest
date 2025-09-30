// app/api/labs/[labId]/inventory/route.ts
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { labId: string } }) {
  const inventory = await db.labInventory.findMany({
    where: { labId: params.labId },
    include: { reagent: true },
  });
  return NextResponse.json(inventory);
}

// POST /api/labs/[labId]/inventory
export async function POST(req: Request, { params }: { params: { labId: string } }) {
  const { reagentId, quantity, unit, expiryDate, reorderThreshold } = await req.json();

  const item = await db.labInventory.upsert({
    where: { labId_reagentId: { labId: params.labId, reagentId } },
    update: { quantity, unit, expiryDate, reorderThreshold },
    create: { labId: params.labId, reagentId, quantity, unit, expiryDate, reorderThreshold },
  });

  return NextResponse.json(item);
}
