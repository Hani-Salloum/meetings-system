import fastifyWebsocket from "@fastify/websocket";
import dotenv from "dotenv";
import Fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
// import admin from "firebase-admin";
import Redis from "ioredis";
import RedisMock from "ioredis-mock";
import env from "./config/env";
// import { firebaseAdminSdkConfig } from "./config/firebase-adminsdk";
import { changeLanguage } from "./config/i18n";
import plugins from "./plugins";
import { initSocketServer } from "./socket/socketServer";
import { globalErrorHandler, notFoundHandler } from "./utils/errorHandler";

dotenv.config();

const fastify = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
});

initSocketServer(fastify);

const redis = env.NODE_ENV === "development" ? new RedisMock() : new Redis();
fastify.decorate("redis", redis);

fastify.register(plugins);

fastify.register(fastifyWebsocket);
fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

fastify.addHook("onRequest", changeLanguage);
fastify.setErrorHandler(globalErrorHandler);

// admin.initializeApp({
//   credential: admin.credential.cert({
//     clientEmail: firebaseAdminSdkConfig.client_email,
//     projectId: firebaseAdminSdkConfig.project_id,
//     privateKey: firebaseAdminSdkConfig.private_key,
//   }),
// });

fastify.get("/", async () => {
  return { message: "nodejs server!" };
});

fastify.get("/socket/test", { websocket: true }, (connection) => {
  connection.socket.on("message", (message: string) => {
    fastify.log.info("Received message from client:", message);
    connection.socket.send("Hello from the server!");
  });
});

fastify.get("/health", async () => {
  try {
    await fastify.prisma.$queryRaw`SELECT 1`;
    return { status: "ok" };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { status: "error", message: error.message };
    }
    return { status: "error", message: "Unknown error" };
  }
});

fastify.setNotFoundHandler(notFoundHandler);

export { fastify };
