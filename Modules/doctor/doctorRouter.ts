import express, { Router  } from "express"
import doctorSlots from "./availability_controller";
import appointmentBook from "./bookAppointment_controller";
import doctorCancelAppointment from "./cancelAppointment_controller";

const router:  Router = express.Router();
router.get("/available/appointment/slots" , doctorSlots);
router.post("/new/appointment" , appointmentBook);
router.patch("/cancel/appointments" , doctorCancelAppointment);