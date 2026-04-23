/*
  Warnings:

  - You are about to drop the column `status` on the `Surgery` table. All the data in the column will be lost.
  - Added the required column `surgeryStatus` to the `Surgery` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Surgery" DROP COLUMN "status",
ADD COLUMN     "surgeryStatus" "SurgeryStatus" NOT NULL;
