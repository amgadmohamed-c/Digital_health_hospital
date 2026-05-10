import express, { Router  } from "express"
import doctorSlots from "./availability_controller";
import appointmentBook from "./bookAppointment_controller";
import doctorCancelAppointment from "./cancelAppointment_controller";
import { setAvailabilityController } from "./setAvailability_controller";
import setVisitDataController from "./setVisitData_controller";
import getDoctors from "./getAvailableDoctors_controller";
import doctorAppointmentController from "./getDoctorAppointment_controller";

export const router:  Router = express.Router();
router.post("/available/appointment/slots", doctorSlots);
router.post("/new/appointment" , appointmentBook);
router.patch("/cancel/appointment" , doctorCancelAppointment);
router.put("/:doctorId/availability", setAvailabilityController);
router.put("/appointment/:appointmentId/visit-data", setVisitDataController);
router.get("/available/doctors", getDoctors) ;
router.get("/doctor/appointments/me" , doctorAppointmentController);

