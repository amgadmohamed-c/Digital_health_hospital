import prisma from "../lib/prisma";

type AddRecordInput = {
  email: string;
  recordTitle: string;
  recordUrls: string[];
};

export async function addMedicalRecord({ email, recordTitle, recordUrls }: AddRecordInput) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");

  const patient = await prisma.patient.findUnique({ where: { userId: user.id } });
  if (!patient) throw new Error("Patient profile not found");

  await prisma.medicalRecord.create({
    data: {
      patientId: patient.id,
      title:     recordTitle,
      fileUrl:   recordUrls,
    },
  });

  return true;
}