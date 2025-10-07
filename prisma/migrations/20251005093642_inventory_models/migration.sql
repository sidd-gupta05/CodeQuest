/*
  Warnings:

  - A unique constraint covering the columns `[labId,customReagentId]` on the table `lab_inventory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "LeaveType" AS ENUM ('SICK_LEAVE', 'CASUAL_LEAVE', 'EARNED_LEAVE', 'MATERNITY_LEAVE', 'PATERNITY_LEAVE', 'EMERGENCY_LEAVE', 'OTHER');

-- CreateEnum
CREATE TYPE "LeaveStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ReagentType" AS ENUM ('CATALOG', 'CUSTOM');

-- AlterTable
ALTER TABLE "lab_inventory" ADD COLUMN     "customReagentId" TEXT,
ALTER COLUMN "reagentId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "reagent_usage_logs" (
    "id" TEXT NOT NULL,
    "labId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "reagentId" TEXT NOT NULL,
    "quantityUsed" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "type" "ReagentType" NOT NULL,
    "previousQuantity" DOUBLE PRECISION NOT NULL,
    "newQuantity" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reagent_usage_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_applications" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "labId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "leaveType" "LeaveType" NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "LeaveStatus" NOT NULL DEFAULT 'PENDING',
    "approvedBy" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leave_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lab_inventory_labId_customReagentId_key" ON "lab_inventory"("labId", "customReagentId");

-- AddForeignKey
ALTER TABLE "lab_inventory" ADD CONSTRAINT "lab_inventory_customReagentId_fkey" FOREIGN KEY ("customReagentId") REFERENCES "CustomReagent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_applications" ADD CONSTRAINT "leave_applications_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_applications" ADD CONSTRAINT "leave_applications_labId_fkey" FOREIGN KEY ("labId") REFERENCES "labs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
