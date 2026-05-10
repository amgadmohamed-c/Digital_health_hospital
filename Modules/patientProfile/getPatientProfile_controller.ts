import { Request , Response } from "express";
import patientData from "./getPatientProfile_service";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | string;
    }
  }
}
export default  async function getPatient(req:Request , res: Response){
    try{
        
        const {email} = req.user as JwtPayload ; 
        if(!email){
            throw new Error("no email was sent");
        }
        const patient = await patientData(email) ;
        console.log(patient);
        return res.status(200).json(patient);


    }
    catch(err:any){
        return res.status(400).json({err:err.message});
    }
}