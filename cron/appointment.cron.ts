import cron from 'node-cron';
import prisma from '../Modules/lib/prisma';
import { closeChatSession } from '../Modules/chat/chatSession_service';
import { closeSocketSession } from '../Modules/chat/chat_socket';
cron.schedule("*/3 * * * *", async () => {
  const now = new Date();
  // Inside your existing cron, after marking appointments COMPLETED:
 

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
        type: "HOSPITAL",
        visit: { is: null }
      }
    });

    // 3. Bulk create visits with room assignment
    if (appointments.length > 0) {
      const rooms = await tx.room.findMany({
        where: {
          status: "AVAILABLE",
        },
        take: appointments.length
      });

      // Mark fetched rooms as OCCUPIED immediately to prevent double-booking
      if (rooms.length > 0) {
        await tx.room.updateMany({
          where: {
            id: { in: rooms.map(r => r.id) }
          },
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

    // 4. Complete expired appointments and free up rooms
    const expiredAppointments = await tx.appointment.findMany({
      where: {
        status: "ACTIVE",
        endsAt: { lte: now }
      },
      include: {
        visit: true
      }
    });

    if (expiredAppointments.length > 0) {
      // Free up rooms from completed visits
      const roomIds = expiredAppointments
        .map(appt => appt.visit?.roomId)
        .filter(Boolean) as string[];
         for (const appt of expiredAppointments) {
        const sessionId = await closeChatSession(appt.id); // close in DB
        if (sessionId) closeSocketSession(sessionId);       // kick all sockets
}

      if (roomIds.length > 0) {
        await tx.room.updateMany({
          where: { id: { in: roomIds } },
          data: { status: "AVAILABLE" }
        });
      }

      await tx.appointment.updateMany({
        where: {
          id: { in: expiredAppointments.map(a => a.id) }
        },
        data: { status: "COMPLETED" }
      });
    }
  });
  

  
}

);