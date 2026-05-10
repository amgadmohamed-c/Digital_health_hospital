import { Request, Response } from "express";
import setAvailability from "./setAvailability_service";
import { JwtPayload } from "jsonwebtoken";
import { isStaff } from "../emergency/createCase_service";

export async function setAvailabilityController(req: Request, res: Response) {
    try {
        const { email } = req.user as JwtPayload;
        const data = req.body;

        if (!email) {
            res.status(400).json({ message: "doctorId is required" });
            return;
        }
        const staff = await isStaff(email);
        if(!staff){
            res.status(401).json({ message: "unauthrized" });
            return;
            
        }

        if (!Array.isArray(data) || data.length === 0) {
            res.status(400).json({ message: "Request body must be a non-empty array" });
            return;
        }
        

        const result = await setAvailability(data, email);

        res.status(200).json({
            message: "Availability updated successfully",
            data: result,
        });
    } catch (error) {
        if (error instanceof Error) {
            const clientErrors = ["Doctor not found", "Availability data cannot be empty"];
            const isClientError = clientErrors.some((msg) => error.message.includes(msg))
                || error.message.startsWith("Invalid");

            if (isClientError) {
                res.status(400).json({ message: error.message });
                return;
            }
        }

        console.error("setAvailability error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}