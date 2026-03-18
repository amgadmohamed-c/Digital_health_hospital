
import  express from "express";
import { router as authroutes} from "./Modules/Auth/signup_Route";
const app = express();
app.listen(8000);
app.use(express.json())
app.use(authroutes);
