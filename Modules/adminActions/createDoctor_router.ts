import express, { Router ,RequestHandler } from "express"
import { Authenticate_Token } from "../Auth/login_Controller";
import { adminCreatedoctor } from "./createDoctor_controller";
export const router: Router = express.Router();
router.post("/createdoctor",  adminCreatedoctor)
