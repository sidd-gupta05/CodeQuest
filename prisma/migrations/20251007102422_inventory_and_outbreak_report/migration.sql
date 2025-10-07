/*
  Warnings:

  - You are about to drop the `CustomReagent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReagentCatalog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TestReagent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."CustomReagent" DROP CONSTRAINT "CustomReagent_labId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TestReagent" DROP CONSTRAINT "TestReagent_reagentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TestReagent" DROP CONSTRAINT "TestReagent_testId_fkey";

-- DropForeignKey
ALTER TABLE "public"."lab_inventory" DROP CONSTRAINT "lab_inventory_customReagentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."lab_inventory" DROP CONSTRAINT "lab_inventory_reagentId_fkey";

-- DropTable
DROP TABLE "public"."CustomReagent";

-- DropTable
DROP TABLE "public"."ReagentCatalog";

-- DropTable
DROP TABLE "public"."TestReagent";

-- CreateTable
CREATE TABLE "custom_reagents" (
    "id" TEXT NOT NULL,
    "labId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "unit" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "quantity" DOUBLE PRECISION,
    "reorderThreshold" DOUBLE PRECISION,
    "manufacturer" TEXT,

    CONSTRAINT "custom_reagents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reagent_catalog" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "unit" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "manufacturer" TEXT,

    CONSTRAINT "reagent_catalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_reagents" (
    "id" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "reagentId" TEXT NOT NULL,
    "quantityPerTest" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "unit" TEXT NOT NULL,

    CONSTRAINT "test_reagents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outbreak_reports" (
    "id" SERIAL NOT NULL,
    "pdfUrl" TEXT NOT NULL,
    "week" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "rawOutput" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "labId" TEXT NOT NULL,
    "suggestions" TEXT NOT NULL,

    CONSTRAINT "outbreak_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "test_reagents_testId_reagentId_key" ON "test_reagents"("testId", "reagentId");

-- CreateIndex
CREATE UNIQUE INDEX "outbreak_reports_labId_key" ON "outbreak_reports"("labId");

-- AddForeignKey
ALTER TABLE "custom_reagents" ADD CONSTRAINT "custom_reagents_labId_fkey" FOREIGN KEY ("labId") REFERENCES "labs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_reagents" ADD CONSTRAINT "test_reagents_reagentId_fkey" FOREIGN KEY ("reagentId") REFERENCES "reagent_catalog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_reagents" ADD CONSTRAINT "test_reagents_testId_fkey" FOREIGN KEY ("testId") REFERENCES "tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_inventory" ADD CONSTRAINT "lab_inventory_customReagentId_fkey" FOREIGN KEY ("customReagentId") REFERENCES "custom_reagents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_inventory" ADD CONSTRAINT "lab_inventory_reagentId_fkey" FOREIGN KEY ("reagentId") REFERENCES "reagent_catalog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
