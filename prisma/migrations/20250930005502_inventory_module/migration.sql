/*
  Warnings:

  - You are about to drop the column `isDisabled` on the `lab_timeslot_exceptions` table. All the data in the column will be lost.
  - You are about to drop the column `appointmentId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the `appointments` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `bookingId` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "public"."BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "public"."ReportStatus" AS ENUM ('BOOKING_PENDING', 'TEST_BOOKED', 'SAMPLE_COLLECTED', 'IN_LAB', 'UNDER_REVIEW', 'REPORT_READY');

-- AlterEnum
ALTER TYPE "public"."UserRole" ADD VALUE 'ADMIN';

-- DropForeignKey
ALTER TABLE "public"."appointments" DROP CONSTRAINT "appointments_labId_fkey";

-- DropForeignKey
ALTER TABLE "public"."appointments" DROP CONSTRAINT "appointments_patientId_fkey";

-- DropForeignKey
ALTER TABLE "public"."payments" DROP CONSTRAINT "payments_appointmentId_fkey";

-- DropIndex
DROP INDEX "public"."patients_userId_key";

-- AlterTable
ALTER TABLE "public"."lab_details" ADD COLUMN     "labcontactNumber" TEXT,
ADD COLUMN     "labemail" TEXT;

-- AlterTable
ALTER TABLE "public"."lab_timeslot_exceptions" DROP COLUMN "isDisabled",
ADD COLUMN     "isUnavailable" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "public"."patients" ADD COLUMN     "age" INTEGER,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "public"."payments" DROP COLUMN "appointmentId",
ADD COLUMN     "bookingId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."appointments";

-- CreateTable
CREATE TABLE "public"."schedules" (
    "labId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id" SERIAL NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."schedule_availabilities" (
    "dayOfWeek" "public"."DayOfWeek" NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "scheduleId" INTEGER NOT NULL,

    CONSTRAINT "schedule_availabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."addons" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "addons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."booking_addons" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "addonId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "booking_addons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."booking_tests" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "booking_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bookings" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "labId" TEXT NOT NULL,
    "timeSlotId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "public"."BookingStatus" NOT NULL DEFAULT 'PENDING',
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "qrCodeData" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "reportStatus" "public"."ReportStatus" NOT NULL DEFAULT 'BOOKING_PENDING',

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tests" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CustomReagent" (
    "id" TEXT NOT NULL,
    "labId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "unit" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomReagent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ReagentCatalog" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "unit" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReagentCatalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TestReagent" (
    "id" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "reagentId" TEXT NOT NULL,
    "quantityPerTest" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestReagent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."lab_inventory" (
    "id" TEXT NOT NULL,
    "labId" TEXT NOT NULL,
    "reagentId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "reorderThreshold" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lab_inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_AvailableTests" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AvailableTests_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_BookingTests" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BookingTests_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "addons_name_key" ON "public"."addons"("name");

-- CreateIndex
CREATE UNIQUE INDEX "booking_addons_bookingId_addonId_key" ON "public"."booking_addons"("bookingId", "addonId");

-- CreateIndex
CREATE UNIQUE INDEX "booking_tests_bookingId_testId_key" ON "public"."booking_tests"("bookingId", "testId");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_bookingId_key" ON "public"."bookings"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "tests_name_key" ON "public"."tests"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TestReagent_testId_reagentId_key" ON "public"."TestReagent"("testId", "reagentId");

-- CreateIndex
CREATE UNIQUE INDEX "lab_inventory_labId_reagentId_key" ON "public"."lab_inventory"("labId", "reagentId");

-- CreateIndex
CREATE INDEX "_AvailableTests_B_index" ON "public"."_AvailableTests"("B");

-- CreateIndex
CREATE INDEX "_BookingTests_B_index" ON "public"."_BookingTests"("B");

-- AddForeignKey
ALTER TABLE "public"."schedules" ADD CONSTRAINT "schedules_labId_fkey" FOREIGN KEY ("labId") REFERENCES "public"."labs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."schedule_availabilities" ADD CONSTRAINT "schedule_availabilities_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "public"."schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "public"."bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."booking_addons" ADD CONSTRAINT "booking_addons_addonId_fkey" FOREIGN KEY ("addonId") REFERENCES "public"."addons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."booking_addons" ADD CONSTRAINT "booking_addons_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "public"."bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."booking_tests" ADD CONSTRAINT "booking_tests_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "public"."bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."booking_tests" ADD CONSTRAINT "booking_tests_testId_fkey" FOREIGN KEY ("testId") REFERENCES "public"."tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bookings" ADD CONSTRAINT "bookings_labId_fkey" FOREIGN KEY ("labId") REFERENCES "public"."labs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bookings" ADD CONSTRAINT "bookings_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bookings" ADD CONSTRAINT "bookings_timeSlotId_fkey" FOREIGN KEY ("timeSlotId") REFERENCES "public"."lab_time_slots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CustomReagent" ADD CONSTRAINT "CustomReagent_labId_fkey" FOREIGN KEY ("labId") REFERENCES "public"."labs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TestReagent" ADD CONSTRAINT "TestReagent_reagentId_fkey" FOREIGN KEY ("reagentId") REFERENCES "public"."ReagentCatalog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TestReagent" ADD CONSTRAINT "TestReagent_testId_fkey" FOREIGN KEY ("testId") REFERENCES "public"."tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."lab_inventory" ADD CONSTRAINT "lab_inventory_labId_fkey" FOREIGN KEY ("labId") REFERENCES "public"."labs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."lab_inventory" ADD CONSTRAINT "lab_inventory_reagentId_fkey" FOREIGN KEY ("reagentId") REFERENCES "public"."ReagentCatalog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AvailableTests" ADD CONSTRAINT "_AvailableTests_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."labs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AvailableTests" ADD CONSTRAINT "_AvailableTests_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_BookingTests" ADD CONSTRAINT "_BookingTests_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_BookingTests" ADD CONSTRAINT "_BookingTests_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
