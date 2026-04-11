import express, { Router  } from "express"
import newPatientProfile from "./editPatientProfile_controller"
import { upload } from "../../multer"; // instead of ../../app

export const router :Router = express.Router()
router.put("/editprofile", upload.fields([
{name:"profile" , maxCount:1}, 
{name : "records"  , maxCount:10}
]) , newPatientProfile)