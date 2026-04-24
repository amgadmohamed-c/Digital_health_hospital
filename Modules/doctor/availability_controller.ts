import { Request,Response} from "express";
import getAvailableTime from "./availability_service";
import { JwtPayload } from "jsonwebtoken";


export default async function  doctorSlots(req:Request , res : Response){
    const {email } = req.user as JwtPayload ; 
    if(!email){
        return res.status(401).json({err:"user access denied "});
    }
    try{
        const slots = await getAvailableTime(req.body.doctorId) ; 
        if(slots.length === 0 ){
            return res.status(200).json({message : "no slots was found"}); 
        }
        return res.status(200).json(slots);

    
    }catch(err:any){
        return res.status(400).json({err:err.message});
    }
    
}