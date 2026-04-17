import { Request , Response } from "express";
import doctorData from "./getDoctorProfile_service";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | string;
    }
  }
}
export default  async function getDoctor(req:Request , res: Response){
    try{
        if (!req.user) return res.status(401).json({ err: "Unauthorized" });
        const {email} = req.user as JwtPayload ; 
        
        if(!email){
            throw new Error("no email was sent");
        }
        const doctor = await doctorData(email) ;
        return res.status(200).json(doctor);


    }
    catch(err:any){
        return res.status(400).json({err:err.message});
    }
}