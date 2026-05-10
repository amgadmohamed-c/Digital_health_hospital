import { Request ,Response } from "express";
import getAvailableDoctors from "./getAvailableDoctors_service";
import { spec } from "node:test/reporters";
import { deprecate } from "node:util";


export default async function getDoctors(req:Request , res:Response){
    try{
      const department = req.query.department as string;

      const doctors = await getAvailableDoctors(department);
        if(doctors.length === 0 ){
            return res.status(200).json({message : "no doctors was found"}); 
        }
        return res.status(200).json(doctors);

    
    }catch(err:any){
        return res.status(400).json({err:err.message});
    }
    
}