
import  express from "express";
import { router as authroutes} from "./Modules/Auth/signup_Route";
import { router as loginroutes } from "./Modules/Auth/login_Router";
import { router as createDoctor } from "./Modules/adminActions/createDoctor_router";
import { router as createNurse } from "./Modules/adminActions/createNurse_router";
const app = express();
app.use(express.json());
app.use(authroutes);
app.use(loginroutes);
app.use(createDoctor);
app.use(createNurse);
app.listen(8000);
