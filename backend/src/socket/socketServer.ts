import { FastifyInstance } from "fastify";
import { Server as SocketIOServer } from "socket.io";
import { HttpConstant } from "src/constants/HttpConstant";
import { CustomError } from "src/utils/custom-error";
// import { verifyTokenSocket } from "../utils/verify-token";

export function initSocketServer(fastify: FastifyInstance) {
  const io = new SocketIOServer(fastify.server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.query.token as string;
      if (!token) {
        throw new CustomError({
          message: "No token provided",
          statusCode: HttpConstant.BAD_REQUEST,
        });
      }

      // const user = await verifyTokenSocket(token);
      // @ts-expect-error - need to add type declaration like in jwt
      socket.user = user;

      next();
    } catch (err: unknown) {
      if (err instanceof CustomError) {
        next(err);
      }
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // @ts-expect-error - need to add type declaration like in jwt
    console.log("User Info:", socket.user);

    socket.emit("message", "Welcome to the WebSocket server!");

    socket.on("send_message", (data) => {
      console.log("Message received:", data);
      io.emit("broadcast_message", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}
