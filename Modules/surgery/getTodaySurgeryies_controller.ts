import { Request , Response } from "express";
import getTodaySurgeries from "./getTodaySurgeryies_service";
import { isStaff } from "../emergency/createCase_service";
import { JwtPayload } from "jsonwebtoken";

export default async function getTodaySurgeriesController(req: Request, res: Response) {
    try {
        const { email } = req.user as JwtPayload;
        if (!email) {
            throw new Error("user email is undefined");
        }
        const staff = await isStaff(email);
        if (!staff) {
            return res.status(403).json({ err: "Forbidden: staff only" });
        }
        const surgeries = await getTodaySurgeries();
        return res.status(200).json(surgeries);
    } catch (err: any) {
        console.log(err.message);
        return res.status(400).json({ err: err.message });
    }
}