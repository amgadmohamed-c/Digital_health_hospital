import express, { Router ,RequestHandler } from "express"
import { Authenticate_Token } from "../Auth/login_Controller";
import { adminCreatenurse } from "./createNurse_controller";
export const router: Router = express.Router();
router.post("/createnurse", Authenticate_Token as RequestHandler, adminCreatenurse)
