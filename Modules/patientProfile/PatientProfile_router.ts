import express, { Router } from "express";
import newPatientProfile from "./editPatientProfile_controller";
import addRecordController from "./addRecord_Controller";
import { upload } from "../../multer";
import getPatient from "./getPatientProfile_controller";
import profileDatabyId from "./getPatientProfileid_controller";
import { getMyAppointments_Controller } from "./getMyAppointment_controller";

export const router: Router = express.Router();

router.put("/editprofile", upload.fields([
  { name: "profile", maxCount: 1 },
  { name: "records", maxCount: 10 },
]), newPatientProfile);

// ── NEW: dedicated records upload endpoint ──
router.post("/patient/records", upload.fields([
  { name: "records", maxCount: 10 },
]), addRecordController);

router.get("/patient/me", getPatient);
router.get("/patient/:id/profile", profileDatabyId);
router.get("/patient/:id/appointments", getMyAppointments_Controller);