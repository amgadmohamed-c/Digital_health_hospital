import  {Request, Response} from 'express';
import setVisitData from './setVisitData_service';

export default async function setVisitDataController(req: Request, res: Response) {
    try {
        const { appointmentId } = req.params as { appointmentId: string };
        const data = req.body;

        if (!appointmentId) {
            res.status(400).json({ message: "appointmentId is required" });
            return;
        }

        const result = await setVisitData(appointmentId, data.diagnosis, data.notes);

        res.status(200).json({
            message: "Visit data updated successfully",
            data: result,
        });
    } catch (error) {
        if (error instanceof Error) {
            const clientErrors = ["Appointment not found", "Invalid visit data"];
            const isClientError = clientErrors.some((msg) => error.message.includes(msg))
                || error.message.startsWith("Invalid");

            if (isClientError) {
                res.status(400).json({ message: error.message });
                return;
            }
        }

        console.error("setVisitData error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}