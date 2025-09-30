import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

// GET /api/tests → list all tests
export async function GET() {
  const tests = await db.tests.findMany({
    include: { TestReagent: { include: { reagent: true } } },
  });
  return NextResponse.json({ tests });
}

// POST /api/tests → create a new test
export async function POST(req: Request) {
  const body = await req.json();
  const { id, name, category, description, price } = body;

  const test = await db.tests.create({
    data: {
      id,
      name,
      category,
      description,
      price,
      updatedAt: new Date(),
    },
  });

  return NextResponse.json(test, { status: 201 });
}
