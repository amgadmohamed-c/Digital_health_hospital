import cron from 'node-cron';
import prisma from '../Modules/lib/prisma';

cron.schedule("*/3 * * * *", async () => {
  const now = new Date();

  await prisma.$transaction(async (tx) => {
    // 1. Activate scheduled appointments
    await tx.appointment.updateMany({
      where: {
        status: "SCHEDULED",
        scheduledAt: { lte: now },
        endsAt: { gte: now }
      },
      data: { status: "ACTIVE" }
    });

    // 2. Find HOSPITAL active appointments with no visit yet
    const appointments = await tx.appointment.findMany({
      where: {
        status: "ACTIVE",
        type: "HOSPITAL",      // 👈 only onsite
        visit: { is: null }    // 👈 no visit yet, eliminates N+1
      }
    });

    // 3. Bulk create visits
    if (appointments.length > 0) {
      await tx.visit.createMany({
        data: appointments.map(appt => ({
          appointmentId: appt.id,
          patientId: appt.patientId,
          doctorId: appt.doctorId,
          departmentId: appt.departmentId
        }))
      });
    }

    // 4. Complete expired appointments
    await tx.appointment.updateMany({
      where: {
        status: "ACTIVE",
        endsAt: { lte: now }
      },
      data: { status: "COMPLETED" }
    });
  });
});