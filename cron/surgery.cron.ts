import cron from 'node-cron';
import prisma from '../Modules/lib/prisma';
cron.schedule("*/15 * * * *", async () => {
  const now = new Date();

  // 1. Get surgeries that should start
  const surgeries = await prisma.surgery.findMany({
    where: {
      surgeryStatus: "PENDING",
      scheduledAt: { lte: now },
      endedAt: { gte: now }
    },
    select: {
      id: true,
      roomId: true
    }
  });

  // extract room IDs
const roomIds = surgeries
  .map(s => s.roomId)
  .filter((id): id is string => id !== null);
  // 2. Update surgeries
  await prisma.surgery.updateMany({
    where: {
      id: { in: surgeries.map(s => s.id) }
    },
    data: {
      surgeryStatus: "IN_PROGRESS"
    }
  });

  // 3. Update rooms
  await prisma.room.updateMany({
    where: {
      id: { in: roomIds }
    },
    data: {
      status : "OCCUPIED"
    }
  });


const finishedSurgeries = await prisma.surgery.findMany({
  where: {
    surgeryStatus: "IN_PROGRESS",
    endedAt: { lte: now }
  },
  select: {
    id: true,
    roomId: true
  }
});


const finishedRoomIds = finishedSurgeries
  .map(s => s.roomId)
  .filter((id): id is string => id !== null);




  // mark surgeries as completed
await prisma.surgery.updateMany({
  where: {
    id: { in: finishedSurgeries.map(s => s.id) }
  },
  data: {
    surgeryStatus: "COMPLETED"
  }
});

// free the rooms
await prisma.room.updateMany({
  where: {
    id: { in: finishedRoomIds }
  },
  data: {
    status: "AVAILABLE"
  }
});
}








);