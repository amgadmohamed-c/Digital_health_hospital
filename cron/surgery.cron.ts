import cron from 'node-cron';
import prisma from '../Modules/lib/prisma';

console.log("surgery cron loaded");

cron.schedule("*/1 * * * *", async () => {
  const now = new Date();

  await prisma.$transaction(async (tx) => {
    // 1. Find PENDING surgeries that should now be starting
    const surgeries = await tx.surgery.findMany({
      where: {
        surgeryStatus: "PENDING",
        scheduledAt: { lte: now },
        endedAt: { gte: now }
      },
      select: { id: true, roomId: true }
    });

    if (surgeries.length > 0) {
      const roomIds = surgeries
        .map(s => s.roomId)
        .filter((id): id is string => id !== null);

      // 2. Mark surgeries as IN_PROGRESS
      await tx.surgery.updateMany({
        where: { id: { in: surgeries.map(s => s.id) } },
        data: { surgeryStatus: "IN_PROGRESS" }
      });

      // 3. Mark their rooms as OCCUPIED
      if (roomIds.length > 0) {
        await tx.room.updateMany({
          where: { id: { in: roomIds } },
          data: { status: "OCCUPIED" }
        });
      }
    }

    // 4. Find IN_PROGRESS surgeries that have now ended
    const finishedSurgeries = await tx.surgery.findMany({
      where: {
        surgeryStatus: "IN_PROGRESS",
        endedAt: { lte: now }
      },
      select: { id: true, roomId: true }
    });

    if (finishedSurgeries.length > 0) {
      const finishedRoomIds = finishedSurgeries
        .map(s => s.roomId)
        .filter((id): id is string => id !== null);

      // 5. Mark surgeries as COMPLETED
      await tx.surgery.updateMany({
        where: { id: { in: finishedSurgeries.map(s => s.id) } },
        data: { surgeryStatus: "COMPLETED" }
      });

      // 6. Free the rooms — runs atomically with the surgery update above
      if (finishedRoomIds.length > 0) {
        await tx.room.updateMany({
          where: { id: { in: finishedRoomIds } },
          data: { status: "AVAILABLE" }
        });
      }
    }
  });
});