import { Request, Response } from "express";
import { isAdmin } from "./createDoctor_service";
import { JwtPayload } from "jsonwebtoken";
import getDoctorWorkLoad from "./getDoctorWorkLoad_service";
export default async function doctorWorkLoad(req: Request, res: Response) {
  const { email } = req.user as JwtPayload;
  if (!email) {
    return res.status(401).json({ err: "admin data not found" });
  }
  try {
    const admin = await isAdmin(email);
    if (!admin) {
      return res.status(403).json({ err: "Forbidden: admin only" });
    }
    const drId = req.params.id as string;
    const data = await getDoctorWorkLoad(drId);
    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(401).json({ err: err.message });
  }
}