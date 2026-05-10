import cron from 'node-cron';
import prisma from '../Modules/lib/prisma';
import { closeChatSession } from '../Modules/chat/chatSession_service';
import { closeSocketSession } from '../Modules/chat/chat_socket';

console.log("appointment cron loaded");

cron.schedule("*/1 * * * *", async () => {
  const now = new Date();
  let expiredAppointmentIds: string[] = [];

  await prisma.$transaction(async (tx) => {
    // 1. Activate scheduled appointments
    const activated = await tx.appointment.updateMany({
      where: {
        status: "SCHEDULED",
        scheduledAt: { lte: now },
        endsAt: { gte: now }
      },
      data: { status: "ACTIVE" }
    });
    console.log("Activated appointments:", activated.count);

    // 2. Find HOSPITAL active appointments with no visit yet
    const appointments = await tx.appointment.findMany({
      where: {
        status: "ACTIVE",
        type: "HOSPITAL",
        visit: { is: null }
      }
    });
    console.log("Appointments needing visits:", appointments);

    // 3. Bulk create visits with room assignment
    if (appointments.length > 0) {
      const rooms = await tx.room.findMany({
        where: { status: "AVAILABLE" },
        take: appointments.length
      });

      // Mark fetched rooms as OCCUPIED immediately to prevent double-booking
      if (rooms.length > 0) {
        await tx.room.updateMany({
          where: { id: { in: rooms.map(r => r.id) } },
          data: { status: "OCCUPIED" }
        });
      }

      await tx.visit.createMany({
        data: appointments.map((appt, index) => ({
          appointmentId: appt.id,
          patientId: appt.patientId,
          doctorId: appt.doctorId,
          departmentId: appt.departmentId,
          roomId: rooms[index]?.id ?? null
        }))
      });
    }

    // 4. Find expired active appointments
    const expiredAppointments = await tx.appointment.findMany({
      where: {
        status: "ACTIVE",
        endsAt: { lte: now }
      },
      include: { visit: true }
    });

    if (expiredAppointments.length > 0) {
      // Collect IDs to close chat sessions AFTER the transaction commits
      expiredAppointmentIds = expiredAppointments.map(a => a.id);

      // Free up rooms from completed visits
      const roomIds = expiredAppointments
        .map(appt => appt.visit?.roomId)
        .filter(Boolean) as string[];

      if (roomIds.length > 0) {
        await tx.room.updateMany({
          where: { id: { in: roomIds } },
          data: { status: "AVAILABLE" }
        });
      }

      await tx.appointment.updateMany({
        where: { id: { in: expiredAppointmentIds } },
        data: { status: "COMPLETED" }
      });
    }
  });

  // Close chat sessions after transaction commits so a rollback
  // doesn't leave sessions closed with no corresponding DB change
  for (const id of expiredAppointmentIds) {
    const sessionId = await closeChatSession(id);
    if (sessionId) closeSocketSession(sessionId);
  }
});