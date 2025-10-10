// app/api/bookings/[bookingId]/deduct-inventory/route.ts
import { db } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(
  _: Request,
  { params }: { params: { bookingId: string } }
) {
  try {
    // First, get the booking with basic info
    const booking = await db.bookings.findUnique({
      where: { id: params.bookingId },
      include: {
        booking_tests: {
          include: {
            tests: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Get all test IDs from the booking
    const testIds = booking.booking_tests.map(bt => bt.testId);

    // Get test reagents for all tests in the booking
    const testReagents = await db.testReagent.findMany({
      where: {
        testId: { in: testIds },
      },
      include: {
        ReagentCatalog: true,
      },
    });

    // Group reagents by test for processing
    const reagentsByTest = testReagents.reduce((acc, tr) => {
      if (!acc[tr.testId]) acc[tr.testId] = [];
      acc[tr.testId].push(tr);
      return acc;
    }, {} as Record<string, typeof testReagents>);

    // Process inventory updates
    for (const bookingTest of booking.booking_tests) {
      const reagents = reagentsByTest[bookingTest.testId] || [];
      
      for (const reagent of reagents) {
        await db.lab_inventory.updateMany({
          where: { 
            labId: booking.labId, 
            reagentId: reagent.reagentId 
          },
          data: { 
            quantity: { 
              decrement: reagent.quantityPerTest 
            } 
          },
        });
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Inventory updated successfully' 
    });

  } catch (error) {
    console.error('Error deducting inventory:', error);
    return NextResponse.json(
      { error: 'Failed to update inventory' }, 
      { status: 500 }
    );
  }
}
