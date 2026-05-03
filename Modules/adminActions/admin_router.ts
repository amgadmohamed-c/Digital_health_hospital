import express, { Router  } from "express"
import { adminCreatedoctor } from "./createDoctor_controller";
import allPatientsData from "./getAllpatients_controller";
import allDoctorsData from "./getAllDoctors_controller";
import { adminCreatenurse } from "./createNurse_controller";
import { adminDeleteUser } from "./deleteUser_controller";
import doctorWorkLoad from "./getDoctorWorkLoad_controller";
export const router: Router = express.Router();
router.post("/createnurse",  adminCreatenurse);

router.post("/createdoctor",  adminCreatedoctor) ; 
router.get("/get/patients/all" , allPatientsData);
router.get("/get/doctors/all" ,allDoctorsData ); 
router.delete("/delete/:id/user" , adminDeleteUser);


router.get("/doctor/:id/workload" , doctorWorkLoad);