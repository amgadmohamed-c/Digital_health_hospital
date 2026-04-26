import { Router  }from "express";
import express from "express";
import createSurgery from "./createSurgery_controller";
import cancelSurgery from "./cancelSurgery_controller";
const router :Router = express.Router();

router.post("/create/surgery" , createSurgery);
router.delete("/cancel/:surgeryId" , cancelSurgery)
