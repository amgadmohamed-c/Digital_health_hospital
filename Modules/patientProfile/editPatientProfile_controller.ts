import { Request , Response } from "express";
import { editPatientProfile } from "./editPatientProfile_service";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | string;
    }
  }
}
export default async function newPatientProfile(req : Request , res : Response ){
    const user = req.user;
    if (!user) {
    return res.status(401).json({ message: "Unauthorized: no user on request" });
  }

    const email = typeof user === "string" ? user : user.email;

    if(!email){
        return res.status(401).json("user not found");
    }
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

const img = files?.["profile"]?.[0]
    ? `http://localhost:8000/uploads/${files["profile"][0].filename}`
    : req.body.img ?? null;

const recordUrls = files?.["records"]?.map(
    file => `http://localhost:8000/uploads/${file.filename}`
) ?? [];
    const data = {
          name: req.body.name ,
          email: email, 
          phone: req.body.phone ,
           age: parseInt(req.body.age),
          gender: req.body.gender, 
          password: req.body.password,
          img :img,
          bloodtype :req.body.bloodtype,
          allergies:req.body.allergies,
          recordTitle : req.body.recordTitle, 
          recordUrl: recordUrls
    } ; 
    console.log(data)
    try{
        const isEdited = await editPatientProfile(data) ; 
        if(isEdited){
        return res.status(200).json({ message: "Profile updated successfully" });
        }

    }
    catch(Err:any){
        return res.status(400).json(Err.message);
    }
}