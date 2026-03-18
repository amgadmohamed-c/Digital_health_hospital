import express from "express"
import { userSignup } from "./signup_Service";
export const router  = express.Router() ;
router.post("/signup" , userSignup)

