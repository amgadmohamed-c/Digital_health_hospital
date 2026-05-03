import prisma from "../lib/prisma";
import { Priority, SurgeryType } from "../../generated/prisma";

type SurgeryDataType = {
  patientId: string;
  surgeonId: string;
  roomId?: string;          // optional — emergency grabs room later
  emergencyQueueId?: string;
  type: SurgeryType;
  priority?: Priority;
  notes?: string;
  scheduledAt?: Date;       // optional — null for emergency
  estimatedDuration?: number;
  requestedBy?: string;
}

export default async function saveSurgery(surgeryData: SurgeryDataType) {
  // Validate based on type
  if (surgeryData.type === "SCHEDULED" && !surgeryData.scheduledAt) {
    throw new Error("scheduledAt is required for scheduled surgeries");
  }
  if (surgeryData.type === "EMERGENCY" && surgeryData.scheduledAt) {
    throw new Error("Emergency surgeries cannot have a scheduledAt");
  }

  const surgery = await prisma.surgery.create({
    data: {
      patientId: surgeryData.patientId,
      surgeonId: surgeryData.surgeonId,
      ...(surgeryData.roomId && { roomId: surgeryData.roomId }),
      ...(surgeryData.emergencyQueueId && { emergencyQueueId: surgeryData.emergencyQueueId }),
      type: surgeryData.type,
      surgeryStatus: "PENDING",
      ...(surgeryData.priority && { priority: surgeryData.priority }),
      ...(surgeryData.notes && { notes: surgeryData.notes }),
      ...(surgeryData.scheduledAt && { scheduledAt: surgeryData.scheduledAt }),
      ...(surgeryData.estimatedDuration && { estimatedDuration: surgeryData.estimatedDuration }),
      requestedBy: surgeryData.requestedBy ?? surgeryData.surgeonId,
      // startedAt and endedAt are NOT set here — updated when surgery actually begins
    }
  });

  return surgery;
}