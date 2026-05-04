import { Express, Router } from "express";
import fetch_controller from "./fetch_controller";

const router:Router = Router();

router.get("/fetchdata" , fetch_controller)

export default router;