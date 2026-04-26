import { Request , Response } from "express";
import { isStaff } from "./createCase_service";
import { JwtPayload } from "jsonwebtoken";
import getAllCases, { getActiveCases, getCriticalCases } from "./getAllCases_service";


export default async function getCases(req: Request , res : Response){
    try{
        const {email} = req.user as JwtPayload ; 
        if(!email ){
            throw new Error("user email is undefined") ; 

        }
        const staff =  await isStaff(email);
                
        if(!staff){
             return res.status(403).json({ err: "Forbidden: staff only" });
         }
        const data =  await getAllCases();
        return res.status(200).json(data);
    }catch(err:any){
        console.log(err.message);
        return res.status(400).json({err:err.message});
    }
    
}

export async function  activeCases(req:Request , res : Response) {
        try{
        const {email} = req.user as JwtPayload ; 
        if(!email ){
            throw new Error("user email is undefined") ; 

        }
        const staff =  await isStaff(email);
        const data =  await getActiveCases();
        return res.status(200).json(data);
    }catch(err:any){
        console.log(err.message);
        return res.status(400).json({err:err.message});
    }
    
}
export async function  criticalCases(req:Request , res : Response) {
        try{
        const {email} = req.user as JwtPayload ; 
        if(!email ){
            throw new Error("user email is undefined") ; 

        }
        const staff =  await isStaff(email);
        const data =  await getCriticalCases();
        return res.status(200).json(data);
    }catch(err:any){
        console.log(err.message);
        return res.status(400).json({err:err.message});
    }
    
}