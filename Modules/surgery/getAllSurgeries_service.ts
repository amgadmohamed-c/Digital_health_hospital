import prisma from "../lib/prisma";

export default async function getAllSurgeriesService() {
  const surgeries = await prisma.surgery.findMany({
    include: {
      patient: { include: { user: true } },
      surgeon: { include: { user: true } },
      room: true,
    },
  });

  return surgeries; // ✅ was missing — function returned undefined before
}