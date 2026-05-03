/*
  Warnings:

  - The `dayOfWeek` column on the `Availability` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Availability" DROP COLUMN "dayOfWeek",
ADD COLUMN     "dayOfWeek" INTEGER[];

-- CreateIndex
CREATE UNIQUE INDEX "Availability_doctorId_dayOfWeek_startTime_key" ON "Availability"("doctorId", "dayOfWeek", "startTime");
