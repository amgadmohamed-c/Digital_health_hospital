import { Request , Response } from "express";
import saveCancelSurgery from "./cancelSurgery_service";
import { JwtPayload } from "jsonwebtoken";
import { isStaff } from "../emergency/createCase_service";


export default async function cancelSurgery(req : Request , res : Response) {
    const {email} = req.user as JwtPayload ;
    if(!email){
        return res.status(401).json({err:"email doesnt exist"});
    }
    try{
        const staff = await isStaff(email);
        if(!staff){
             return res.status(403).json({ err: "Forbidden: staff only" });
         }
        const id = req.params.surgeryId as string ; 

        const data = await saveCancelSurgery(id);
        if(!data){
            throw new Error("couldnt cancel");
        }
        return res.status(200).json({
            message : "deleted surgery "
        })

    }
    catch(err:any){
        return res.status(400).json({err:err.message});
    }
    
}