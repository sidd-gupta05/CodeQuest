-- AlterTable
ALTER TABLE "CustomReagent" ADD COLUMN     "manufacturer" TEXT;

-- AlterTable
ALTER TABLE "ReagentCatalog" ADD COLUMN     "manufacturer" TEXT;

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "reportUrl" TEXT;

-- AlterTable
ALTER TABLE "tests" ADD COLUMN     "duration" TEXT;
