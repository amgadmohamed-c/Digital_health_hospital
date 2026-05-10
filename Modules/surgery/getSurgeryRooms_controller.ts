import  {Request , Response} from "express"
import getSurgeryRoomsService from "./getSurgeryRooms_service"
import { JwtPayload } from "jsonwebtoken"
import { isStaff } from "../emergency/createCase_service";

export default async function getSurgeryRoomsController(req:Request, res : Response) {
    const {email} = req.user as  JwtPayload
    if(!email){
        return res.status(403).json({message : "email is null"});
    }
    try{
        const staff = await isStaff(email);
        if(!staff){
            return res.status(401).json({message : "unauthrized access"});
        }
        const rooms = await getSurgeryRoomsService();
        return res.status(200).json(rooms)
    }
    catch(err:any){
        return res.status(500).json({message : err.message});
    }

}