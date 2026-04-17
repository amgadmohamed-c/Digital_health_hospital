-- CreateEnum
CREATE TYPE "SurgeryStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "bio" TEXT;

-- AlterTable
ALTER TABLE "EmergencyQueue" ADD COLUMN     "doctorId" TEXT;

-- CreateTable
CREATE TABLE "Surgery" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "surgeonId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "emergencyQueueId" TEXT,
    "status" "SurgeryStatus" NOT NULL,
    "notes" TEXT,
    "scheduledAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Surgery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Surgery_emergencyQueueId_key" ON "Surgery"("emergencyQueueId");

-- AddForeignKey
ALTER TABLE "EmergencyQueue" ADD CONSTRAINT "EmergencyQueue_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Surgery" ADD CONSTRAINT "Surgery_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Surgery" ADD CONSTRAINT "Surgery_surgeonId_fkey" FOREIGN KEY ("surgeonId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Surgery" ADD CONSTRAINT "Surgery_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Surgery" ADD CONSTRAINT "Surgery_emergencyQueueId_fkey" FOREIGN KEY ("emergencyQueueId") REFERENCES "EmergencyQueue"("id") ON DELETE SET NULL ON UPDATE CASCADE;
