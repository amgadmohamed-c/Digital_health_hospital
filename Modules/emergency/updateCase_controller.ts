import { Request , Response } from "express";
import { isStaff } from "./createCase_service";
import { JwtPayload } from "jsonwebtoken";
import updateCase from "./updateCase_service";
import { QueueStatus } from "../../generated/prisma";



export default async function updateCaseData(req:Request  , res:Response) {
        try{
            const {email} = req.user as JwtPayload ; 
            if(!email ){
                throw new Error("user email is undefined") ; 
    
            }
            const validStatuses = ["WAITING", "IN_TREATMENT", "STABLE", "ADMITTED", "DISCHARGED"];
            if (!validStatuses.includes(req.body.status)) {
                 return res.status(400).json({ err: "invalid status value" });
                    }

            const newdata = {
                id : req.body.id , 
                status : req.body.status as QueueStatus

            }
            const staff =  await isStaff(email);
            const data =  await updateCase(newdata);
            return res.status(200).json(data);
        }catch(err:any){
            console.log(err.message);
            return res.status(400).json({err:err.message});
        }
        
    }
    
    
