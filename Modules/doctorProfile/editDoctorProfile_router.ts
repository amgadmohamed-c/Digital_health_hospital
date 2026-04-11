import express, { Router  } from "express"
import newDoctorProfile from "./editDoctorProfile_controller";
import { upload } from "../../multer"; // instead of ../../app

export const router :Router = express.Router()
router.put("/editdoctorprofile", upload.single("img") , newDoctorProfile)