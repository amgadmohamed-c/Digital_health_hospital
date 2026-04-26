import { Response , Request } from "express";
import saveSurgery from "./createSurgery_service";
import { JwtPayload } from "jsonwebtoken";
import { isStaff } from "../emergency/createCase_service";


export default async function createSurgery(req:Request , res: Response) {
    const {email} = req.user  as JwtPayload ;
    if(!email){
        return res.status(401).json({err:"unauthoriezed access email wasnt found"});
    }
    try{
        const staff = await isStaff(email);
        if(!staff){
             return res.status(403).json({ err: "Forbidden: staff only" });
         }
        const surgeryData ={
          patientId : req.body.patientId,
          surgeonId : req.body.surgeonId ,
          roomId    : req.body.roomId,
          emergencyQueueId: req.body.emergencyQueueId ,
          type      :  req.body.surgeryType , 
          priority  : req.body.priority,
          notes     :req.body.notes ,
          scheduledAt : req.body.scheduledAt , 
          estimatedDuration  :req.body.estimatedDuration , 
          startedAt :   req.body.startedAt ,
        }
        const surgery = await saveSurgery(surgeryData);
        if(!surgery){
            throw new Error("couldn't save surgery");
        }
        return res.status(201).json(surgery);

    }
    catch(err:any){
        console.log(err.message);
        return res.status(400).json({err:err.message});
    }

    
}