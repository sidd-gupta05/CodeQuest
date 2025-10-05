/*
  Warnings:

  - A unique constraint covering the columns `[labId]` on the table `outbreak_reports` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "outbreak_reports_labId_key" ON "outbreak_reports"("labId");
