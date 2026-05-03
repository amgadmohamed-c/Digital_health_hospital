import { Request , Response } from "express";
import cancelAppointment from "./cancelAppointment_service";
import { isStaff } from "../emergency/createCase_service";
import { JwtPayload } from "jsonwebtoken";


export default async function doctorCancelAppointment(req:Request , res : Response) {
    const {email} = req.user as JwtPayload ; 
    if(!email){
        return res.status(401).json({err:"email doesnt exist"});
    }
    try{
        const staff = await isStaff(email);
        console.log(staff);
        if(!staff){
             return res.status(403).json({ err: "Forbidden: staff only" });
         }
        const data = {
            appointmentId: req.body.id , 
            appointmentStatus : req.body.appintmentStatus
        }
        const cancelledAppointment = await cancelAppointment(data);
        if(!cancelAppointment){
            throw new Error("couldnt cancel")

        }
        return res.status(200).json({message : "deleted appointment successfully"});
    }
    catch(err:any){
        console.log(err.message);
        return res.status(400).json({
            err:err.message
        }) ; 
    }
    
}