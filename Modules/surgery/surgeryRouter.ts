import { Router } from "express";
import express from "express";
import createSurgery from "./createSurgery_controller";
import cancelSurgery from "./cancelSurgery_controller";
import createSurgeryNoteController from "./createSurgeryNote_controller";
import getTodaySurgeriesController from "./getTodaySurgeryies_controller";
import { getPatientSurgeries_Controller } from "./getPatientSurgeries_controller";
import getDoctorSurgeriesController from "./getDoctorSurgeries_controller";
import getSurgeryRoomsController from "./getSurgeryRooms_controller";

const router: Router = express.Router();

router.post("/create/surgery", createSurgery);
router.delete("/cancel/:surgeryId", cancelSurgery);
router.put("/:surgeryId/notes", createSurgeryNoteController);
router.get("/get/today/surgeries", getTodaySurgeriesController);
router.get("/get/my/surgeries" , getDoctorSurgeriesController);
router.get("/get/surgery/rooms" , getSurgeryRoomsController);

// No :patientId param — the controller reads the patient from the JWT
router.get("/patient/surgeries", getPatientSurgeries_Controller);

export default router;