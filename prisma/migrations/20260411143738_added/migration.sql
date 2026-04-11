/*
  Warnings:

  - The `fileUrl` column on the `MedicalRecord` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "MedicalRecord" DROP COLUMN "fileUrl",
ADD COLUMN     "fileUrl" TEXT[];
