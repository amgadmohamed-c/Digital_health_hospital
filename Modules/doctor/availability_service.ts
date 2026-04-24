import prisma from "../lib/prisma";

type TimeSlot = {
    startTime: Date;
    endTime: Date;
    taken: boolean;
};

function toTodayDate(timeStr: string): Date {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const d = new Date();
    d.setHours(hours, minutes, 0, 0);
    return d;
}

export default async function getAvailableTime(drId: string): Promise<TimeSlot[]> {
    const now = new Date();

    const doctor = await prisma.doctor.findUnique({ where: { id: drId } });
    if (!doctor) throw new Error("Doctor not found");

    const windows = await prisma.availability.findMany({
        where: { doctorId: drId, dayOfWeek: now.getDay(), isActive: true }
    });
    if (windows.length === 0) throw new Error("No availability found for today");

    const startOfDay = new Date(now); startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);   endOfDay.setHours(23, 59, 59, 999);

    const booked = await prisma.appointment.findMany({
        where: {
            doctorId: drId,
            status: { not: "CANCELLED" },
            scheduledAt: { gte: startOfDay, lte: endOfDay }
        }
    });
    const surgeries = await prisma.surgery.findMany({
       where: {
          surgeonId: drId,
          surgeryStatus: { notIn: ["CANCELLED", "COMPLETED"] },
          scheduledAt: { gte: startOfDay, lte: endOfDay }
    }
});

// Normalize surgeries into the same shape as appointments
     const surgeryBlocks = surgeries
        .filter(s => s.scheduledAt && s.estimatedDuration)
        .map(s => ({
        scheduledAt: s.scheduledAt!,
        durationMinutes: s.estimatedDuration!
    }));
    const allBlocks = [...booked, ...surgeryBlocks];


    // ✅ handles all availability windows, not just the last one
    return windows.flatMap(w => generateSlots(w.startTime, w.endTime, w.slotDuration, allBlocks));
}

function generateSlots(
    start: string,
    end: string,
    slotDuration: number,
    booked: { scheduledAt: Date; durationMinutes: number }[]
): TimeSlot[] {
    const startTime = toTodayDate(start);
    const endTime = toTodayDate(end);
    let current = startTime;
    const slots: TimeSlot[] = [];

    while (current < endTime) {
        const slotEnd = new Date(current.getTime() + slotDuration * 60 * 1000);
        if (slotEnd > endTime) break;

        const taken = booked.some(appt => {
            const apptEnd = new Date(appt.scheduledAt.getTime() + appt.durationMinutes * 60 * 1000);
            return current < apptEnd && slotEnd > appt.scheduledAt;
        });

        slots.push({ startTime: new Date(current), endTime: slotEnd, taken });
        current = slotEnd;
    }

    return slots;
}