/*
  Warnings:

  - Added the required column `suggestions` to the `outbreak_reports` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "outbreak_reports" ADD COLUMN     "suggestions" TEXT NOT NULL;
