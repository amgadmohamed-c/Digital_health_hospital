-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('AVAILABLE', 'IN_USE', 'MAINTENANCE', 'OUT_OF_SERVICE');

-- CreateTable
CREATE TABLE "MedicalDevice" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "status" "DeviceStatus" NOT NULL DEFAULT 'AVAILABLE',
    "serialNo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MedicalDevice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MedicalDevice" ADD CONSTRAINT "MedicalDevice_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
