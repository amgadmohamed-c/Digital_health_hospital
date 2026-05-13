import prisma from "../lib/prisma";

export default async function getSurgeryRoomsService() {
  try {
    const dep = await prisma.department.findFirst({
      where: { name: "SURGERY" },
    });

    if (!dep) {
      throw new Error("Surgery department doesn't exist yet.");
    }

    const rooms = await prisma.room.findMany({
      where: { departmentId: dep.id },
      include: {
        surgeries: {
          where: {
            surgeryStatus: { in: ["PENDING", "IN_PROGRESS"] },
          },
          select: {
            id: true,
            scheduledAt: true,
            surgeryStatus: true,
          },
        },
        devices: {          // ← new
          select: {
            id: true,
            name: true,
            type: true,
            status: true,
            serialNo: true,
          },
          orderBy: { name: "asc" },
        },
      },
    });

    return rooms;
  } catch (err: any) {
    throw new Error(err.message);
  }
}