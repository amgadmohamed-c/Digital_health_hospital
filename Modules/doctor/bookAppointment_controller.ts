import { Request , Response } from "express";
import saveAppointment from "./bookAppointment_service";
import { JwtPayload } from "jsonwebtoken";


export default async function appointmentBook(req:Request , res : Response){
    const {email} = req.user as JwtPayload ;
    if(!email){
        return res.status(401).json({err:"user doesnt exist"});

    }
    const type = ["HOSPITAL" ,"ONLINE"] 
    if(!type.includes(req.body.appointmentType)){
        throw new Error("appointment type is wrong");

     
    }
    const status = ["SCHEDULED",  "ACTIVE", "COMPLETED", "CANCELLED"]
    if(status.includes(req.body.appintmentStatus)){
         throw new Error("appointment status is wrong");        
    }
    
    try{
        const data = {
            email : email  , 
            doctorId : req.body.doctorId , 
            schuledAt : req.body.scheduledAt , 
            appointmentStatus :req.body.appintmentStatus , 
            appointmentType : req.body.appointmentType , 
            duration : req.body.duration

        }
        const appointment = saveAppointment(data);
        if(!appointment){
            throw new Error("something wrong happened");
        }
    }
    catch(err:any){
        console.log(err.message);
        return res.status(400).json({err:err.message});
    }
    
}