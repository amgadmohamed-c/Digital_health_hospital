
import  express from "express";
import { router as authroutes} from "./Modules/Auth/signup_Route";
import { router as loginroutes } from "./Modules/Auth/login_Router";
const app = express();
app.use(express.json())
app.use(authroutes);
app.use(loginroutes)
app.listen(8000);
