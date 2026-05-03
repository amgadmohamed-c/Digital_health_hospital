import { Request, Response } from "express";
import createSurgeryNote from "./createSurgeryNote_service";

export default async function createSurgeryNoteController(req: Request, res: Response) {
    const { surgeryId } = req.params as { surgeryId: string };
    const { content } = req.body;

    if (!surgeryId || !content) {
        return res.status(400).json({ err: "surgeryId and content are required" });
    }

    try {
        const surgery = await createSurgeryNote(surgeryId, content);
        return res.status(200).json(surgery);
    } catch (err: any) {
        console.log(err.message);
        return res.status(400).json({ err: err.message });
    }
}