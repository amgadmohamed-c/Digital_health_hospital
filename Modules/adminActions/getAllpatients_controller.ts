import { Request,Response } from "express";
import { isAdmin } from "./createDoctor_service";
import { JwtPayload } from "jsonwebtoken";
import getAllPatient  from "./getAllPatients_service";
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | string;
    }
  }
}
export default async function allPatientsData(req:Request , res : Response) {
    const {email} = req.user as JwtPayload
    if(!email){
        return res.status(401).json({err:"admin data not found"});
    }
    try{
        const admin = await isAdmin(email);
        const data = await getAllPatient();
        return res.status(200).json(data);
        
    }
    catch(err:any){
        return res.status(401).json({err: err.message});
    }
    
}