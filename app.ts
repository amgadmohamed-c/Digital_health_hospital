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
import { initSocketServer } from "./Modules/chat/chat_socket";
import chatRoute from "./Modules/chat/chat_route";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors())


app.use("/uploads", express.static("./upload"));

app.use(authroutes);
app.use(loginroutes);
app.use(fetchRoute);
app.use(Authenticate_Token as RequestHandler);
app.use(doctorProfile);
app.use(patientProfile);
app.use(adminActions);
app.use(emergency);
app.use("/chat", chatRoute); // 👈 prefix added

const server = createServer(app); // 👈 create http server first
initSocketServer(server);         // 👈 attach socket.io before listening

server.listen(8000, () => console.log("Server running on port 8000"));