import { Server as HttpServer } from "http";
import { Server as SocketServer, Socket } from "socket.io";
import dotenv from "dotenv";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
  validateUserForSession,
  saveMessage,
} from "./chatSession_service";

dotenv.config();

let io: SocketServer;

export function initSocketServer(server: HttpServer) {
  io = new SocketServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: false,
    }
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      console.log("🔵 socket auth token:", token);
      if (!token) return next(new Error("Missing token"));

      const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload;
      console.log("🔵 payload:", payload);
      if (!payload.email) return next(new Error("Invalid token"));

      socket.data.email = payload.email;
      next();
    } catch (e) {
      console.log("🔴 jwt verify error:", e);
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    console.log("✅ new socket connection:", socket.id);

    socket.on("join_session", async (sessionId: string) => {
      console.log("🔵 joining session:", sessionId);
      try {
        const { session, senderId, senderType } = await validateUserForSession(
          sessionId,
          socket.data.email
        );

        socket.data.sessionId = session.id;
        socket.data.senderId = senderId;
        socket.data.senderType = senderType;

        socket.join(sessionId);

        socket.emit("joined", {
          sessionId: session.id,
          message: "Connected to chat session"
        });

        console.log("✅ joined session:", sessionId, "as:", senderType);

      } catch (err: any) {
        console.log("🔴 join_session error:", err.message);
        socket.emit("error", { message: err.message });
      }
    });

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
        io.to(sessionId).emit("new_message", message);

      } catch (err: any) {
        console.log("🔴 send_message error:", err.message);
        socket.emit("error", { message: err.message });
      }
    });

    socket.on("disconnect", () => {
      console.log("🔵 socket disconnected:", socket.id);
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

export function closeSocketSession(sessionId: string) {
  if (!io) return;
  io.to(sessionId).emit("session_ended", {
    message: "Appointment has ended. Chat is now closed."
  });
  io.in(sessionId).disconnectSockets(true);
}