import prisma from "../lib/prisma";

export default async function getDoctorSurgeriesService(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { doctor: true },
    });

    if (!user?.doctor) {
      throw new Error("Doctor profile not found for this user");
    }

    const surgeries = await prisma.surgery.findMany({
      where: { surgeonId: user.doctor.id },
      orderBy: { scheduledAt: "desc" },
      include: {
        room: true,
        emergencyQueue: true,
        patient: {
          include: { user: true },
        },
        // ✅ Include the surgeon's own profile + user so the frontend
        //    can read surgery.surgeon.user.name and surgery.surgeon.specialization
        surgeon: {
          include: { user: true },
        },
      },
    });

    return surgeries;
  } catch (err: any) {
    console.error("getDoctorSurgeriesService error:", err.message);
    throw new Error(err.message);
  }
}