import prisma from "../lib/prisma";

export default async function getPatientAppointments(email: string) {
  try {
    // Resolve the patient record from the JWT email
    const patient = await prisma.patient.findFirst({
      where: {
        user: { email },
      },
      select: { id: true },
    });

    if (!patient) {
      throw new Error("Patient not found for this account");
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        patientId: patient.id,
      },
      include: {
        doctor: {
          include: {
            user: true,       // name, email, phone, gender
            department: true, // department name
          },
        },
      },
      orderBy: {
        scheduledAt: "desc",
      },
    });

    return appointments;
  } catch (error) {
    console.error("Error fetching patient appointments:", error);
    throw error;
  }
}