import express, { Router  } from "express"
import createCase from "./createCase_controller";
import getCases, { activeCases, criticalCases } from "./getAllCases_controller";
import updateCaseData from "./updateCase_controller";

export const router :Router = express.Router() ; 

router.post("/emergency"   , createCase);
router.get("/get/all/emergency" , getCases);
router.get("/get/active/emergency" , activeCases); 
router.get("/get/critical/emergency" , criticalCases);
router.patch("/update/emergency/" ,updateCaseData )
