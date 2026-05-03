import prisma from "../lib/prisma";

type WeekData = {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    slotDuration?: number;
};

export default async function setAvailability(
    data: WeekData[],
    doctorId: string
): Promise<typeof result> {
    // Input validation
    if (!data || data.length === 0) {
        throw new Error("Availability data cannot be empty");
    }

    for (const d of data) {
        if (d.startTime >= d.endTime) {
            throw new Error(
                `Invalid time range for day ${d.dayOfWeek}: startTime must be before endTime`
            );
        }
        if (d.dayOfWeek < 0 || d.dayOfWeek > 6) {
            throw new Error(`Invalid dayOfWeek: ${d.dayOfWeek}. Must be 0–6`);
        }
    }

    // Verify doctor exists
    const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) throw new Error("Doctor not found");

    // Atomic delete + recreate to fully replace availability
    await prisma.$transaction([
        prisma.availability.deleteMany({ where: { doctorId } }),
        prisma.availability.createMany({
            data: data.map((d) => ({
                doctorId,
                dayOfWeek: d.dayOfWeek,
                startTime: d.startTime,
                endTime: d.endTime,
                slotDuration: d.slotDuration ?? 30,
                isActive: true,
            })),
        }),
    ]);

    const result = await prisma.availability.findMany({
        where: { doctorId },
        orderBy: { dayOfWeek: "asc" },
    });

    return result;
}