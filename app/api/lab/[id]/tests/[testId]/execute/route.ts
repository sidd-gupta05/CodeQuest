import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { v4 as uuid } from "uuid";

interface ExecuteTestBody {
  bookingId: string;
  patientId: string;
  quantity?: number;
}

export async function POST(
  req: NextRequest,
  { params }: { params: { labId: string; testId: string } }
) {
  try {
    const { labId, testId } = params;
    const { bookingId, patientId, quantity = 1 }: ExecuteTestBody = await req.json();

    // Validate required fields
    if (!bookingId || !patientId) {
      return NextResponse.json(
        { error: "bookingId and patientId are required" },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      return NextResponse.json(
        { error: "Quantity must be greater than 0" },
        { status: 400 }
      );
    }

    const result = await db.$transaction(async (tx) => {
      // 1. Verify test exists and belongs to lab
      const test = await tx.tests.findFirst({
        where: {
          id: testId,
          labs: {
            some: { id: labId }
          }
        },
        include: {
          TestReagent: {
            include: {
              ReagentCatalog: true
            }
          }
        }
      });

      if (!test) {
        throw new Error("Test not found or not available in this lab");
      }

      // 2. Verify booking exists and belongs to patient
      const booking = await tx.bookings.findFirst({
        where: {
          id: bookingId,
          patientId: patientId,
          labId: labId
        }
      });

      if (!booking) {
        throw new Error("Booking not found or invalid");
      }

      // 3. Check reagent availability and prepare updates
      const reagentUpdates = [];
      const lowStockAlerts = [];
      const usageLogs = [];

      for (const testReagent of test.TestReagent) {
        const totalRequired = testReagent.quantityPerTest * quantity;
        
        // Find inventory item (check both reagentId and customReagentId)
        const inventoryItem = await tx.lab_inventory.findFirst({
          where: {
            labId,
            OR: [
              { reagentId: testReagent.reagentId },
              { customReagentId: testReagent.reagentId }
            ]
          },
          include: {
            ReagentCatalog: true,
            CustomReagent: true
          }
        });

        if (!inventoryItem) {
          throw new Error(
            `Reagent "${testReagent.ReagentCatalog?.name || testReagent.reagentId}" not found in inventory`
          );
        }

        // Check sufficient quantity
        if (inventoryItem.quantity < totalRequired) {
          throw new Error(
            `Insufficient "${inventoryItem.ReagentCatalog?.name || inventoryItem.CustomReagent?.name}". ` +
            `Available: ${inventoryItem.quantity} ${inventoryItem.unit}, Required: ${totalRequired} ${testReagent.unit}`
          );
        }

        // Calculate new quantity after deduction
        const newQuantity = inventoryItem.quantity - totalRequired;

        // Check for low stock alert
        if (inventoryItem.reorderThreshold !== null && newQuantity <= inventoryItem.reorderThreshold) {
          lowStockAlerts.push({
            reagentId: testReagent.reagentId,
            reagentName: inventoryItem.ReagentCatalog?.name || inventoryItem.CustomReagent?.name,
            currentQuantity: newQuantity,
            reorderThreshold: inventoryItem.reorderThreshold,
            unit: inventoryItem.unit
          });
        }

        // Prepare inventory update
        reagentUpdates.push(
          tx.lab_inventory.update({
            where: { id: inventoryItem.id },
            data: {
              quantity: newQuantity,
              updatedAt: new Date()
            }
          })
        );

        // Create usage log
        usageLogs.push(
          tx.reagentUsageLog.create({
            data: {
              id: uuid(),
              labId,
              testId,
              bookingId,
              reagentId: testReagent.reagentId,
              quantityUsed: totalRequired,
              unit: testReagent.unit,
              type: inventoryItem.ReagentCatalog ? 'CATALOG' : 'CUSTOM',
              previousQuantity: inventoryItem.quantity,
              newQuantity: newQuantity
            }
          })
        );
      }

      // 4. Execute all updates
      await Promise.all([...reagentUpdates, ...usageLogs]);

      // 5. Mark test as executed in booking_tests
    //   const bookingTest = await tx.booking_tests.upsert({
    //     where: {
    //       bookingId_testId: {
    //         bookingId,
    //         testId
    //       }
    //     },
    //     update: {
    //     },
    //     create: {
    //       id: uuid(),
    //       bookingId,
    //       testId,
    //       status: 'COMPLETED',
    //       executedAt: new Date()
    //     }
    //   });

      // 6. Update booking status if needed
      await tx.bookings.update({
        where: { id: bookingId },
        data: {
          status: 'COMPLETED',
          updatedAt: new Date()
        }
      });

      // 7. Get updated inventory snapshot
      const updatedInventory = await tx.lab_inventory.findMany({
        where: { labId },
        include: {
          ReagentCatalog: true,
          CustomReagent: true
        }
      });

      return {
        success: true,
        message: `Successfully executed ${quantity} ${test.name} test(s)`,
        testExecuted: test.name,
        quantity,
        // bookingTest,
        lowStockAlerts,
        updatedInventory: updatedInventory.map(item => ({
          id: item.id,
          reagentId: item.reagentId || item.customReagentId,
          name: item.ReagentCatalog?.name || item.CustomReagent?.name,
          quantity: item.quantity,
          unit: item.unit,
          reorderThreshold: item.reorderThreshold,
          expiryDate: item.expiryDate
        }))
      };
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("Error executing test:", err);
    
    if (err instanceof Error) {
      const errorMessage = err.message;
      
      if (errorMessage.includes("not found") || errorMessage.includes("invalid")) {
        return NextResponse.json({ error: errorMessage }, { status: 404 });
      }
      
      if (errorMessage.includes("Insufficient")) {
        return NextResponse.json({ error: errorMessage }, { status: 400 });
      }
    }

    return NextResponse.json(
      { error: "Failed to execute test" },
      { status: 500 }
    );
  }
}