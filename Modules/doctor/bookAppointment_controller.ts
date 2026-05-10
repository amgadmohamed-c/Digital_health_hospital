import { Request , Response } from "express";
import saveAppointment from "./bookAppointment_service";
import { JwtPayload } from "jsonwebtoken";


export default async function appointmentBook(req: Request, res: Response) {
    const { email } = req.user as JwtPayload;
    if (!email) return res.status(401).json({ err: "user doesnt exist" });

    // FIX 1: Look for 'type' or ensure frontend sends 'appointmentType'
    const validTypes = ["HOSPITAL", "ONLINE"];
    const appointmentType = req.body.type || req.body.appointmentType; 

    if (!validTypes.includes(appointmentType)) {
        return res.status(400).json({ err: "appointment type is wrong" });
    }

    // FIX 2: Correct the status logic (added ! and default value)
    const validStatuses = ["SCHEDULED", "ACTIVE", "COMPLETED", "CANCELLED"];
    const appointmentStatus = req.body.status || req.body.appointmentStatus || "SCHEDULED";

    if (!validStatuses.includes(appointmentStatus)) {
        return res.status(400).json({ err: "appointment status is wrong" });
    }

    try {
        const data = {
            email: email,
            doctorId: req.body.doctorId,
            // FIX 3: Ensure dates are Date objects for the service
            schuledAt: new Date(req.body.startTime || req.body.scheduledAt), 
            appointmentStatus: appointmentStatus as any,
            appointmentType: appointmentType as any,
            duration: req.body.duration || 30,
        };
        
        const appointment = await saveAppointment(data); // Added await
        return res.status(200).json(appointment);
    } catch (err: any) {
        return res.status(400).json({ err: err.message });
    }
}