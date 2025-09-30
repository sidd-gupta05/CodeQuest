// app/api/bookings/[bookingId]/deduct-inventory/route.ts
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(_: Request, { params }: { params: { bookingId: string } }) {
  const booking = await db.bookings.findUnique({
    where: { id: params.bookingId },
    include: {
      booking_tests: {
        include: {
          tests: {
            include: { TestReagent: { include: { reagent: true } } },
          },
        },
      },
    },
  });

  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  for (const bt of booking.booking_tests) {
    for (const tr of bt.tests.TestReagent) {
      await db.labInventory.updateMany({
        where: { labId: booking.labId, reagentId: tr.reagentId },
        data: { quantity: { decrement: tr.quantityPerTest } },
      });
    }
  }

  return NextResponse.json({ success: true, message: "Inventory updated" });
}
