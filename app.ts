import express, { RequestHandler } from "express";
import { createServer } from "http"; // 👈 add this
import { router as authroutes } from "./Modules/Auth/signup_Route";
import { router as loginroutes } from "./Modules/Auth/login_Router";
import { router as adminActions } from "./Modules/adminActions/admin_router";
import { Authenticate_Token } from "./Modules/Auth/login_Controller";
import { router as patientProfile } from "./Modules/patientProfile/PatientProfile_router";
import { router as doctorProfile } from "./Modules/doctorProfile/DoctorProfile_router";
import { router as emergency } from "./Modules/emergency/emergencyRouter";
import fetchRoute from "./Modules/fetchedUiData/fetch_router";
import router  from "./Modules/surgery/surgeryRouter"
import {router as doctor} from "./Modules/doctor/doctorRouter"
import { initSocketServer } from "./Modules/chat/chat_socket";
import chatRoute from "./Modules/chat/chat_route";
import cors from "cors";
import "./cron/appointment.cron";
import "./cron/surgery.cron"
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: "*",
  credentials: false,
}));

app.use("/uploads", express.static("./upload"));

app.use(authroutes);
app.use(loginroutes);
app.use(fetchRoute);
app.use(Authenticate_Token as RequestHandler);
app.use(doctor)
app.use(doctorProfile);
app.use(patientProfile);
app.use(adminActions);
app.use(emergency);
app.use("/chat", chatRoute)
 app.use(router); // 👈 prefix added

const server = createServer(app); 
initSocketServer(server);        

server.listen(8000, () => console.log("Server running on port 8000"));