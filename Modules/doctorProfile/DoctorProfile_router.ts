import express, { Router  } from "express"
import newDoctorProfile from "./editDoctorProfile_controller";
import { upload } from "../../multer"; // instead of ../../app
import getDoctor from "./getDoctorProfile_controller";
import profileDatabyId from "./getDrProfileId_controller";

export const router :Router = express.Router() ; 
router.put("/editdoctorprofile", upload.single("img") , newDoctorProfile) ; 
router.get("/doctor/me" ,getDoctor );
router.get("/doctor/:id/profile" ,profileDatabyId );