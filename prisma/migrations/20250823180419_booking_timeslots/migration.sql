/*
  Warnings:

  - You are about to drop the column `password` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `lab_details_to_time_slots` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `slots` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `time_slots` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."Session" AS ENUM ('MORNING', 'AFTERNOON', 'EVENING');

-- DropForeignKey
ALTER TABLE "public"."lab_details_to_time_slots" DROP CONSTRAINT "lab_details_to_time_slots_labDetailsId_fkey";

-- DropForeignKey
ALTER TABLE "public"."lab_details_to_time_slots" DROP CONSTRAINT "lab_details_to_time_slots_timeSlotId_fkey";

-- DropForeignKey
ALTER TABLE "public"."slots" DROP CONSTRAINT "slots_timeSlotId_fkey";

-- DropForeignKey
ALTER TABLE "public"."time_slots" DROP CONSTRAINT "time_slots_labId_fkey";

-- AlterTable
ALTER TABLE "public"."lab_details" ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "password";

-- DropTable
DROP TABLE "public"."lab_details_to_time_slots";

-- DropTable
DROP TABLE "public"."slots";

-- DropTable
DROP TABLE "public"."time_slots";

-- CreateTable
CREATE TABLE "public"."lab_time_slots" (
    "id" TEXT NOT NULL,
    "labId" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "session" "public"."Session" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lab_time_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."lab_timeslot_exceptions" (
    "id" TEXT NOT NULL,
    "labTimeSlotId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "isDisabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lab_timeslot_exceptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lab_time_slots_labId_time_key" ON "public"."lab_time_slots"("labId", "time");

-- CreateIndex
CREATE UNIQUE INDEX "lab_timeslot_exceptions_labTimeSlotId_date_key" ON "public"."lab_timeslot_exceptions"("labTimeSlotId", "date");

-- AddForeignKey
ALTER TABLE "public"."lab_time_slots" ADD CONSTRAINT "lab_time_slots_labId_fkey" FOREIGN KEY ("labId") REFERENCES "public"."labs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."lab_timeslot_exceptions" ADD CONSTRAINT "lab_timeslot_exceptions_labTimeSlotId_fkey" FOREIGN KEY ("labTimeSlotId") REFERENCES "public"."lab_time_slots"("id") ON DELETE CASCADE ON UPDATE CASCADE;
