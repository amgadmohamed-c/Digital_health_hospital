import { Request, Response } from "express";
import { isStaff } from "./createCase_service";
import createEmergencyCase from "./createCase_service";
import { JwtPayload } from "jsonwebtoken";

export default async function createCase(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { email } = req.user as JwtPayload;

  try {
    const staff = await isStaff(email);
    if (!staff || (!staff.doctor && !staff.nurse)) {
      return res.status(403).json({ error: "Forbidden: staff only" });
    }

    const { patientEmail, ssn, gender, doctorId, department, priority } = req.body;

    if (!department) return res.status(400).json({ error: "Department is required" });
    if (!priority) return res.status(400).json({ error: "Priority is required" });

    let emergency;

    if (!patientEmail) {
      // Walk-in patient
      if (!ssn) return res.status(400).json({ error: "SSN is required for walk-in patients" });

      emergency = await createEmergencyCase({
        email: `${ssn}@hospital.internal`,
        password: "0000",
        name: "Walk-in Patient",
        phone: "0000000000",
        age: 0,
        ssn,
        gender,
        doctorId,
        department,
        priority,
      });
    } else {
      // Existing patient by email
      emergency = await createEmergencyCase({
        email: patientEmail,
        doctorId,
        department,
        priority,
      });
    }

    return res.status(201).json({ message: "Case created successfully", caseId: emergency.id });

  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}