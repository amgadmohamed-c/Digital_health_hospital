
import  express, { RequestHandler } from "express";
import { router as authroutes} from "./Modules/Auth/signup_Route";
import { router as loginroutes } from "./Modules/Auth/login_Router";
import { router as adminActions } from "./Modules/adminActions/admin_router";
import { Authenticate_Token } from "./Modules/Auth/login_Controller";
import { router as patientProfile } from "./Modules/patientProfile/PatientProfile_router";
import { router as doctorProfile } from "./Modules/doctorProfile/DoctorProfile_router";
import { router as emergency } from "./Modules/emergency/emergencyRouter";

const app = express();
app.use(express.json());

app.use("/uploads", express.static("./upload")); // separate, with prefix

app.use(authroutes);
app.use(loginroutes);
app.use(Authenticate_Token as RequestHandler)
app.use(doctorProfile);
app.use(patientProfile );
app.use(adminActions);
app.use(emergency);
app.listen(8000);
