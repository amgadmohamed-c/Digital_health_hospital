import { Request, Response } from "express";
import {  isStaff }  from "./createCase_service";
import createEmergencyCase from "./createCase_service";
import { JwtPayload } from "jsonwebtoken";
import { Priority } from "@prisma/client";


export default async function createCase(req:Request , res : Response ) {
    if(!req.user){
        return res.status(401).json({error : "user not defined"});
    }
    const {email} = req.user as JwtPayload ; 
    try{
        const Staff = await isStaff(email) ; 
        if(!req.body.patientId ){
            const data  = {
                email : `${req.body.ssn}@gmail.com` , 
                password : "0000" , 
                name : "ePatient" , 
                phone : "1234" , 
                age : 20 , 
                ssn : req.body.ssn , 
                gender : req.body.Gender  , 
                doctorId : req.body.doctorId  , 
                department : req.body.department , 
                priority : req.body.priority, 
            }
            const emergency = await createEmergencyCase(data) ; 

            return res.status(201).json({message : "case was created succesfully"}); 
        }
             const data  = { 
                email  : req.body.email , 
                doctorId : req.body.doctorId  , 
                department : req.body.department , 
                priority : req.body.priority, 
            }
            const emergency = await createEmergencyCase(data);

            return res.status(201).json({message : "case was created succesfully"}); 


    }catch(err:any){
        return res.status(400).json({err : err.message});
    }
    
}