import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../lib/prisma";
import {
  getOrCreateChatSession,
  getSessionMessages,
} from "./chatSession_service";

// POST /chat/session
// Creates a session (or returns existing one).
// If appointment is COMPLETED/CANCELLED but session already exists → still returns it
// so the frontend can load history.
export async function startChatSession(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  const { appointmentId } = req.body;
  if (!appointmentId)
    return res.status(400).json({ error: "appointmentId is required" });

  try {
    const session = await getOrCreateChatSession(appointmentId);
    return res.status(200).json(session);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}

// GET /chat/session/:sessionId/messages
// Always returns messages — no appointment status check here.
// This is intentional: doctors and patients can review history after completion.
export async function getChatMessages(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  const { sessionId } = req.params as { sessionId: string };

  try {
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: { appointment: true },
    });

    if (!session) return res.status(404).json({ error: "Session not found" });

    const messages = await getSessionMessages(sessionId);
    return res.status(200).json({ session, messages });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}