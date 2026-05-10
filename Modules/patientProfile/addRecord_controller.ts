import { Request, Response } from "express";
import { addMedicalRecord } from "./addRecord_Service";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | string;
    }
  }
}

export default async function addRecordController(req: Request, res: Response) {
  const user = req.user;
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  const email = typeof user === "string" ? user : user.email;
  if (!email) return res.status(401).json({ message: "User not found" });

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const recordUrls = files?.["records"]?.map(
    (file) => `http://localhost:8000/uploads/${file.filename}`
  ) ?? [];

  const recordTitle = req.body.recordTitle;
  if (!recordTitle) return res.status(400).json({ message: "recordTitle is required" });
  if (!recordUrls.length) return res.status(400).json({ message: "At least one file is required" });

  try {
    await addMedicalRecord({ email, recordTitle, recordUrls });
    return res.status(201).json({ message: "Record added successfully" });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}