import express, { Router  } from "express"
import newPatientProfile from "./editPatientProfile_controller"
import { upload } from "../../multer"; // instead of ../../app
import getPatient from "./getPatientProfile_controller";
import profileDatabyId from "./getPatientProfileid_controller";

export const router :Router = express.Router()
router.put("/editprofile", upload.fields([
{name:"profile" , maxCount:1}, 
{name : "records"  , maxCount:10}
]) , newPatientProfile)
router.get("/patient/me" , getPatient);
router.get("/patient/:id/profile" ,profileDatabyId );