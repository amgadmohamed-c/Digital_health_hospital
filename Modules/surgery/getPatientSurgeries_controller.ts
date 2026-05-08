import { Request, Response } from "express";
import getPatientSurgeries from "./getPatientSurgeries_service";
import { JwtPayload } from "jsonwebtoken";

export const getPatientSurgeries_Controller = async (req: Request, res: Response) => {
    const {email} = req.user as  JwtPayload// Assuming the JWT payload includes the patient's email
    if(!email){
        return res.status(403).json({message: "Forbidden — patient access only"})
    }
  try {
    // patientId comes from the verified JWT payload, not from the URL.
    // This prevents a patient from querying another patient's surgeries.

    const surgeries = await getPatientSurgeries(email);
    res.status(200).json(surgeries);
  } catch (error) {
    console.error("Error fetching patient surgeries:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};