/*
  Warnings:

  - The values [IN_PROGRESS,DONE] on the enum `QueueStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `type` to the `Surgery` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('AVAILABLE', 'OCCUPIED', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "SurgeryType" AS ENUM ('SCHEDULED', 'EMERGENCY', 'URGENT');

-- CreateEnum
CREATE TYPE "PrepStatus" AS ENUM ('PENDING', 'READY', 'FAILED');

-- AlterEnum
BEGIN;
CREATE TYPE "QueueStatus_new" AS ENUM ('WAITING', 'IN_TREATMENT', 'STABLE', 'ADMITTED', 'DISCHARGED');
ALTER TABLE "EmergencyQueue" ALTER COLUMN "status" TYPE "QueueStatus_new" USING ("status"::text::"QueueStatus_new");
ALTER TYPE "QueueStatus" RENAME TO "QueueStatus_old";
ALTER TYPE "QueueStatus_new" RENAME TO "QueueStatus";
DROP TYPE "public"."QueueStatus_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Surgery" DROP CONSTRAINT "Surgery_roomId_fkey";

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "durationMinutes" INTEGER NOT NULL DEFAULT 30;

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "status" "RoomStatus" NOT NULL DEFAULT 'AVAILABLE';

-- AlterTable
ALTER TABLE "Surgery" ADD COLUMN     "approvedBy" TEXT,
ADD COLUMN     "estimatedDuration" INTEGER,
ADD COLUMN     "priority" "Priority",
ADD COLUMN     "requestedBy" TEXT,
ADD COLUMN     "type" "SurgeryType" NOT NULL,
ALTER COLUMN "roomId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Availability" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "slotDuration" INTEGER NOT NULL DEFAULT 30,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleException" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "isBlocked" BOOLEAN NOT NULL DEFAULT true,
    "startTime" TEXT,
    "endTime" TEXT,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScheduleException_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurgeryPrep" (
    "id" TEXT NOT NULL,
    "surgeryId" TEXT NOT NULL,
    "task" TEXT NOT NULL,
    "status" "PrepStatus" NOT NULL DEFAULT 'PENDING',
    "assignedTo" TEXT,
    "dueAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SurgeryPrep_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Availability_doctorId_dayOfWeek_startTime_key" ON "Availability"("doctorId", "dayOfWeek", "startTime");

-- CreateIndex
CREATE UNIQUE INDEX "ScheduleException_doctorId_date_key" ON "ScheduleException"("doctorId", "date");

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleException" ADD CONSTRAINT "ScheduleException_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Surgery" ADD CONSTRAINT "Surgery_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurgeryPrep" ADD CONSTRAINT "SurgeryPrep_surgeryId_fkey" FOREIGN KEY ("surgeryId") REFERENCES "Surgery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
