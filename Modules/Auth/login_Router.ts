import express, { Router ,RequestHandler } from "express"
import { Authenticate_Token, createnewtoken, Login_Auth } from "./login_Controller";
export const router: Router = express.Router();
router.post("/login", Login_Auth)
router.post("/reauth" , createnewtoken)