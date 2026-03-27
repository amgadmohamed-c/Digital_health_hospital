import { Request,Response } from "express";
import createDoctor , {isAdmin} from "./createDoctor_service";
import { JwtPayload } from "jsonwebtoken";
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | string;
    }
  }
}
export async function adminCreatedoctor(req:Request,res:Response) {
    if (!req.user) {
    return res.status(401).json({ err: "Unauthorized: no user found on request" });
         }

    try{
        const isadmin = await isAdmin(req.user.toString());
        
    }catch(Err:any){
        return res.status(401).json(Err.message || "user might not be admin");
    }
    try{
        const data = {
                name : req.body.name , 
                email:req.body.email , 
                password :req.body.password , 
                Dep : req.body.department , 
                specialization : req.body.specialization ,
                phone:req.body.phone,
                age:req.body.age,
                gender:req.body.gender,

        }
        const newDoctor = await createDoctor(data);
        if(newDoctor){
            return res.status(201).json(newDoctor);
        }
        else{
            return res.status(400).json({err: "bad request user data was wrong"})
        }
 

    }catch(err:any){
        return res.status(400).json({err :err.message});
        
    }



}