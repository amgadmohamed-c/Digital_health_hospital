import { Request, Response } from "express";
import setAvailability from "./setAvailability_service";

export async function setAvailabilityController(req: Request, res: Response) {
    try {
        const { doctorId } = req.params as { doctorId: string };
        const data = req.body;

        if (!doctorId) {
            res.status(400).json({ message: "doctorId is required" });
            return;
        }

        if (!Array.isArray(data) || data.length === 0) {
            res.status(400).json({ message: "Request body must be a non-empty array" });
            return;
        }

        const result = await setAvailability(data, doctorId);

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