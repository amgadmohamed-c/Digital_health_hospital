import prisma from "../lib/prisma";

export default async function getTodaySurgeries() {
  const start = new Date();
  start.setHours(0, 0, 0, 0); // 2026-05-03T00:00:00.000Z

  const end = new Date();
  end.setHours(23, 59, 59, 999); // 2026-05-03T23:59:59.999Z

  const surgeries = await prisma.surgery.findMany({
    where: {
      scheduledAt: {
        gte: start,
        lte: end
      }
    },
    include: {
      patient: { include: { user: true } },
      surgeon: { include: { user: true } },
      room: true,
    }
  });

  return surgeries; // return empty array, not an error — no surgeries today is valid
}