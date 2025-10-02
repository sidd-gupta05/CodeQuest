/*
  Warnings:

  - Added the required column `unit` to the `TestReagent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."CustomReagent" ADD COLUMN     "expiryDate" TIMESTAMP(3),
ADD COLUMN     "quantity" DOUBLE PRECISION,
ADD COLUMN     "reorderThreshold" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."TestReagent" ADD COLUMN     "unit" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."bookings" ADD COLUMN     "allocatedEmpId" TEXT;

-- AlterTable
ALTER TABLE "public"."lab_inventory" ADD COLUMN     "batchNumber" TEXT;

-- CreateTable
CREATE TABLE "public"."employee" (
    "id" TEXT NOT NULL,
    "labId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "monthlySalary" DOUBLE PRECISION NOT NULL,
    "department" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."bookings" ADD CONSTRAINT "bookings_allocatedEmpId_fkey" FOREIGN KEY ("allocatedEmpId") REFERENCES "public"."employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."employee" ADD CONSTRAINT "employee_labId_fkey" FOREIGN KEY ("labId") REFERENCES "public"."labs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
