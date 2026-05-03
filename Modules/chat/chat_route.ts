import { Router } from "express";
import { startChatSession, getChatMessages } from "./chatSession_controller";;

const router = Router();

// POST /chat/session — create or get session
router.post("/session", startChatSession);

// GET /chat/session/:sessionId/messages — fetch history
router.get("/session/:sessionId/messages", getChatMessages);

export default router;