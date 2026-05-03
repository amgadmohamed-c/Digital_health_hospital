import prisma from "../lib/prisma";


export default async function setVisitData(
    appointmentId: string,
    diagnosis: string,
    notes: string
) {
    // Validate appointment exists
    const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });
    if (!appointment) throw new Error("Appointment not found");

    // Update or create visit data
    const visitData = await prisma.visit.upsert({
        where: { appointmentId }, 
        update: { diagnosis, notes },
         create:{diagnosis,notes, appointmentId, patientId: appointment.patientId, doctorId: appointment.doctorId, departmentId: appointment.departmentId}
    });
    return visitData;
}