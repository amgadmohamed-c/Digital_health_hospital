import { Response, Request } from "express";
import saveSurgery from "./createSurgery_service";
import { JwtPayload } from "jsonwebtoken";
import { isStaff } from "../emergency/createCase_service";

export default async function createSurgery(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ err: "Unauthorized" });
  }

  const { email } = req.user as JwtPayload;

  try {
    const staff = await isStaff(email);
    if (!staff || (!staff.doctor && !staff.nurse)) {
      return res.status(403).json({ err: "Forbidden: staff only" });
    }

    const { patientId, surgeonId, roomId, emergencyQueueId, surgeryType, priority, notes, scheduledAt, estimatedDuration } = req.body;

    // Required fields
    if (!patientId) return res.status(400).json({ err: "patientId is required" });
    if (!surgeryType) return res.status(400).json({ err: "surgeryType is required" });

    const surgery = await saveSurgery({
      patientId,
      email,
      roomId,
      emergencyQueueId,
      type: surgeryType,
      priority,
      notes,// Parse date strings from request body safely
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      estimatedDuration: estimatedDuration ? Number(estimatedDuration) : undefined,
      requestedBy: staff.doctor?.id
    });

    return res.status(201).json(surgery);

  } catch (err: any) {
    console.log(err.message);
    return res.status(400).json({ err: err.message });
  }
}