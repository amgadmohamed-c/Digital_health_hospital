import { Request,Response } from "express";
import { createNurse }  from "./createNurse_service";
import { isAdmin } from "./createDoctor_service";
import { JwtPayload } from "jsonwebtoken";
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | string;
    }
  }
}
export async function adminCreatenurse(req:Request,res:Response) {
    if (!req.user) {
    return res.status(401).json({ err: "Unauthorized: no user found on request" });
         }

    try{
        const isadmin = await isAdmin(req.user.toString());
        
    }catch(Err:any){
        return res.status(401).json({err :Err.message || "user might not be admin"});
    }
    try{
        const data = {
                name : req.body.name , 
                email:req.body.email , 
                password :req.body.password , 
                Dep : req.body.department , 
                phone:req.body.phone,
                age:req.body.age,
                gender:req.body.gender,

        }
        const newNurse = await createNurse(data);
        if(newNurse){
            return res.status(201).json(newNurse);
        }
        else{
            return res.status(400).json({err: "bad request user data was wrong"})
        }
 

    }catch(err:any){
        return res.status(400).json({err :err.message});
        
    }



}