import { Request , Response } from "express";
import editDoctorProfile from "./editDoctorProfile_service";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | string;
    }
  }
}
export default async function newDoctorProfile(req : Request , res : Response ){
    const user = req.user;
    if (!user) {
    return res.status(401).json({ message: "Unauthorized: no user on request" });
  }

    const email = typeof user === "string" ? user : user.email;

    if(!email){
        return res.status(401).json("user not found");
    }
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

const img = req.file
    ? `http://localhost:8000/uploads/${req.file.filename}`
    : req.body.img ?? null;


    const data = {
          name: req.body.name ,
          email: email, 
          specilization: req.body.specialty ,
          bio : req.body.bio , 
          img :img,
          experience :req.body.experience
       
    } ; 
    console.log(data)
    try{
        const isEdited = await editDoctorProfile(data) ; 
        if(isEdited){
        return res.status(200).json({ message: "Profile updated successfully" });
        }

    }
    catch(Err:any){
        return res.status(400).json(Err.message);
    }
}