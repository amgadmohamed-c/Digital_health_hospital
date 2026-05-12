import { Request ,Response } from "express";
import getAllSurgeriesService from "./getAllSurgeries_service";
import { isStaff } from "../emergency/createCase_service";
import { JwtPayload } from "jsonwebtoken";


export default async function getAllSurgeriesController(req : Request , res : Response){
    const {email} = req.user as JwtPayload
    if(!email){
        return res.status(403).json({message : "request refused"});
    }
    try{
        const staff = await isStaff(email);
        if(!staff){
            return res.status(401).json({message : "user not staff"});
        }
        const surgeries = await getAllSurgeriesService();
        return res.status(200).json(surgeries);
    }
    catch(err:any){
        return res.status(500).json({message : err.message});
    }
}