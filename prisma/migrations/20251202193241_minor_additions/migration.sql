/*
  Warnings:

  - A unique constraint covering the columns `[labId,invoiceNumber]` on the table `bookings` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "discount" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "invoiceNumber" SERIAL,
ADD COLUMN     "netAmount" DOUBLE PRECISION,
ADD COLUMN     "tax" DOUBLE PRECISION DEFAULT 0;

-- CreateTable
CREATE TABLE "report_customizations" (
    "id" TEXT NOT NULL,
    "labId" TEXT NOT NULL,
    "settings" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "report_customizations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "report_customizations_labId_key" ON "report_customizations"("labId");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_labId_invoiceNumber_key" ON "bookings"("labId", "invoiceNumber");

-- AddForeignKey
ALTER TABLE "report_customizations" ADD CONSTRAINT "report_customizations_labId_fkey" FOREIGN KEY ("labId") REFERENCES "labs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
