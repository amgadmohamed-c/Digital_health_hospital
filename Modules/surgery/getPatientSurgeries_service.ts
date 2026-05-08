import prisma from "../lib/prisma";

export default async function getPatientSurgeries(patientEmail: string) {
  try {
    const patient = await prisma.user.findUnique({
        where:{email: patientEmail},
        include: { patient: true }
    }).then(user => user?.patient);

    if (!patient) {
      throw new Error("Patient not found");
    }   
    const surgeries = await prisma.surgery.findMany({
      where: {
        
        patientId: patient.id,
      },
      include: {
        surgeon: {
          include: {
            user: true,
          },
        },
        room: true,
        prepTasks: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return surgeries;
  } catch (error) {
    console.error("Error fetching patient surgeries:", error);
    throw error;
  }
}