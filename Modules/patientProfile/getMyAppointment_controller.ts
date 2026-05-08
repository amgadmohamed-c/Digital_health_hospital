import { Request,Response } from "express";
import getPatientAppointments from "./getMyAppointments_service";
import { JwtPayload } from "jsonwebtoken";

export const getMyAppointments_Controller = async (req: Request, res: Response) => {
    const {email} = req.user as  JwtPayload// Assuming the JWT payload includes the patient's email
    if(!email){
        return res.status(403).json({message: "Forbidden — patient access only"})
    }
  try {
    // patientId comes from the verified JWT payload, not from the URL.
    // This prevents a patient from querying another patient's appointments.

    const appointments = await getPatientAppointments(email);
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching patient appointments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};