import {Request , Response } from "express"
import getDoctorSurgeriesService from "./getDoctorSurgeries_service"
import { JwtPayload } from "jsonwebtoken"
import { isStaff } from "../emergency/createCase_service";


export default async function getDoctorSurgeriesController( req : Request , res : Response) {
    const {email} = req.user as JwtPayload
    if(!email){
        res.status(401).json({message : "user unauthorized"});
        return;
    }
     
    try{
        const staff = await isStaff(email);
        if(!staff){
            return res.status(403).json({
                message : "forbidden access to user "
            })
        }
        const surgeries = await getDoctorSurgeriesService(email);
        return res.status(200).json(surgeries);
    }
    catch(err:any){
        return  res.status(500).json({message : err.message});
    }
}