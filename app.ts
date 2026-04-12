
import  express, { RequestHandler } from "express";
import { router as authroutes} from "./Modules/Auth/signup_Route";
import { router as loginroutes } from "./Modules/Auth/login_Router";
import { router as createDoctor } from "./Modules/adminActions/createDoctor_router";
import { router as createNurse } from "./Modules/adminActions/createNurse_router";
import { Authenticate_Token } from "./Modules/Auth/login_Controller";
import { router as patientProfile } from "./Modules/patientProfile/PatientProfile_router";
import { router as doctorProfile } from "./Modules/doctorProfile/DoctorProfile_router";

const app = express();
app.use(express.json());

app.use("/uploads", express.static("./upload")); // separate, with prefix

app.use(authroutes);
app.use(loginroutes);
app.use(Authenticate_Token as RequestHandler)
app.use(doctorProfile);
app.use(patientProfile );
app.use(createDoctor);
app.use(createNurse);
app.listen(8000);
