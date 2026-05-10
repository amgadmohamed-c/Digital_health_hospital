import {Request , Response } from "express"
import DoctorAppointmentService from "./getDoctorAppointment_service"
import { JwtPayload } from "jsonwebtoken";


export default async function doctorAppointmentController(req:Request , res : Response) {
    const {email} = req.user as JwtPayload ;

    if(!email){
        res.status(401).json({message : "user unauthirized"});
        return ; 
    }
    try{
        const appointments = await DoctorAppointmentService(email);
        return res.status(200).json(appointments);
    }
    catch(err:any){
        return res.status(500).json(err.message);
    }

    
}