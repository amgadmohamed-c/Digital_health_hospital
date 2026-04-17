import { Request,Response } from "express";
import   {isAdmin} from "./createDoctor_service";
import DeleteUser from "./deleteUser_service";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | string;
    }
  }
}
export async function adminDeleteUser(req:Request,res:Response) {
    if (!req.user) {
    return res.status(401).json({ err: "Unauthorized: no user found on request" });
         }

    try{
        console.log(req.user.toString())
        const {email}  = req.user as JwtPayload;
        console.log(email)
        const isadmin = await isAdmin(email);
        if(isadmin != true){
            throw new Error("user is not admin")
        }
        const id = req.params.id ; 
        if(!id || Array.isArray(id)){
           return res.status(400).json({err:"user id is undefined"});
        } 
        const deletedUser  = await DeleteUser(id);
        return res.status(200).send({message :"user deleted"});


    }catch(Err:any){
        return res.status(401).json({err :Err.message || "user might not be admin"});
    }
}