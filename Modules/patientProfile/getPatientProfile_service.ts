import prisma from "../lib/prisma";

export default async function patientData(patient: string) {
  try {
    const myPatient = await prisma.user.findUnique({
      where: { email: patient },
    });
    if (!myPatient) throw new Error("User not found");

    const patientProfile = await prisma.patient.findUnique({
      where: { userId: myPatient.id },
      // FIX 4: include records so the frontend can display them
      // (the response was missing records entirely — patientProfile.records was always undefined)
      include: {
        records: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
    if (!patientProfile) throw new Error("Patient profile not found");

    return {
      id:     myPatient.id,   // FIX 5: expose top-level id so frontend can use it for appointments fetch
      name:   myPatient.name,
      email:  myPatient.email,
      phone:  myPatient.phone,
      age:    myPatient.age,
      gender: myPatient.gender,
      patientProfile,
    };
  } catch (err: any) {
    throw new Error(err.message);
  }
}