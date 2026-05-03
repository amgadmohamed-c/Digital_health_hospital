import prisma from "../lib/prisma";

export async function getOrCreateChatSession(appointmentId: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId }
  });

  if (!appointment) throw new Error("Appointment not found");
  if (appointment.type !== "ONLINE") throw new Error("Chat is only for online appointments");
  if (appointment.status === "COMPLETED" || appointment.status === "CANCELLED") {
    throw new Error("Appointment is no longer active");
  }

  const existing = await prisma.chatSession.findUnique({
    where: { appointmentId }
  });
  if (existing) return existing;

  return await prisma.chatSession.create({
    data: {
      appointmentId,
      startedAt: new Date()
    }
  });
}

export async function saveMessage(
  sessionId: string,
  senderId: string,
  senderType: "DOCTOR" | "PATIENT",
  content: string
) {
  const session = await prisma.chatSession.findUnique({
    where: { id: sessionId },
    include: { appointment: true }
  });

  if (!session) throw new Error("Session not found");
  if (session.endedAt) throw new Error("Chat session has ended");
  if (session.appointment.status !== "ACTIVE") {
    throw new Error("Appointment is not active");
  }

  return await prisma.message.create({
    data: { sessionId, senderId, senderType, content }
  });
}

export async function closeChatSession(appointmentId: string) {
  const session = await prisma.chatSession.findUnique({
    where: { appointmentId }
  });
  if (!session || session.endedAt) return;

  await prisma.chatSession.update({
    where: { appointmentId },
    data: { endedAt: new Date() }
  });

  return session.id; // return sessionId so socket server can emit to the room
}

export async function getSessionMessages(sessionId: string) {
  return await prisma.message.findMany({
    where: { sessionId },
    orderBy: { createdAt: "asc" }
  });
}

export async function validateUserForSession(
  sessionId: string,
  email: string
) {
  const session = await prisma.chatSession.findUnique({
    where: { id: sessionId },
    include: { appointment: true }
  });

  if (!session) throw new Error("Session not found");
  if (session.endedAt) throw new Error("Session has ended");

  const user = await prisma.user.findUnique({
    where: { email },
    include: { patient: true, doctor: true }
  });

  if (!user) throw new Error("User not found");

  const appt = session.appointment;
  const isPatient = user.patient?.id === appt.patientId;
  const isDoctor = user.doctor?.id === appt.doctorId;

  if (!isPatient && !isDoctor) throw new Error("Forbidden");

  return {
    session,
    senderId: isDoctor ? user.doctor!.id : user.patient!.id,
    senderType: (isDoctor ? "DOCTOR" : "PATIENT") as "DOCTOR" | "PATIENT"
  };
}