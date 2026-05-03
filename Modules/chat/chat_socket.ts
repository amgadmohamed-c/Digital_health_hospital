import { Server as HttpServer } from "http";
import { Server as SocketServer, Socket } from "socket.io";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
  validateUserForSession,
  saveMessage,
} from "./chatSession_service";

let io: SocketServer;

export function initSocketServer(server: HttpServer) {
  io = new SocketServer(server, {
    cors: {
      origin: process.env.CLIENT_URL || "*",
      methods: ["GET", "POST"]
    }
  });

  // Auth middleware — runs before every connection
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error("Missing token"));

      const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      if (!payload.email) return next(new Error("Invalid token"));

      socket.data.email = payload.email;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    // ── Join a chat room ──────────────────────────────────────────
    socket.on("join_session", async (sessionId: string) => {
      try {
        const { session, senderId, senderType } = await validateUserForSession(
          sessionId,
          socket.data.email
        );

        // Store on socket for use in message handler
        socket.data.sessionId = session.id;
        socket.data.senderId = senderId;
        socket.data.senderType = senderType;

        // Join Socket.io room keyed by sessionId
        socket.join(sessionId);

        socket.emit("joined", {
          sessionId: session.id,
          message: "Connected to chat session"
        });

      } catch (err: any) {
        socket.emit("error", { message: err.message });
        socket.disconnect();
      }
    });

    // ── Send a message ────────────────────────────────────────────
    socket.on("send_message", async (content: string) => {
      try {
        const { sessionId, senderId, senderType } = socket.data;

        if (!sessionId) {
          return socket.emit("error", { message: "Join a session first" });
        }
        if (!content?.trim()) {
          return socket.emit("error", { message: "Message cannot be empty" });
        }

        const message = await saveMessage(sessionId, senderId, senderType, content);

        // Broadcast to everyone in the room including sender
        io.to(sessionId).emit("new_message", message);

      } catch (err: any) {
        socket.emit("error", { message: err.message });
      }
    });

    // ── Disconnect ────────────────────────────────────────────────
    socket.on("disconnect", () => {
      const { sessionId } = socket.data;
      if (sessionId) {
        socket.to(sessionId).emit("user_left", {
          message: "The other participant has disconnected"
        });
      }
    });
  });

  return io;
}

// Called by cron when appointment ends
export function closeSocketSession(sessionId: string) {
  if (!io) return;
  io.to(sessionId).emit("session_ended", {
    message: "Appointment has ended. Chat is now closed."
  });
  // Disconnect all sockets in the room
  io.in(sessionId).disconnectSockets(true);
}