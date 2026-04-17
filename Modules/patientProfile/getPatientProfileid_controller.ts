import { Request , Response } from "express";
import patientProfileId from "./getPatientProfileId_service";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | string;
    }
  }
}

export default async function profileDatabyId(req:Request,res:Response) { 
    const id = req.params.id ; 
    if(!id || Array.isArray(id)){
      return res.status(400).json({err:"user id is undefined"});
    }
    try{
      const data = await patientProfileId(id) ; 
      return res.status(200).json(data);

    }catch(err:any){
      return res.status(500).json({err:err.message});
    }
    
    
}
