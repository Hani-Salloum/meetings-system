import { FastifyInstance } from "fastify";
import autoload from "./autoload";
import calculateDistance from "./calculate-distance";
// import client from "./client";
import compress from "./compress";
import cookies from "./cookies";
import cors from "./cors";
import emailPlugin from "./email-plugin";
import helmet from "./helmet";
import jwt from "./jwt";
// import notificationsPlugin from "./notifications";
import prisma from "./prisma";
import rateLimit from "./rateLimit";
// import scheduling from "./scheduling";
import permission from "./permission";
import _static from "./static";
import swagger from "./swagger";
import swaggerSplit from "./swagger-split";
import swaggerUi from "./swaggerUi";
import view from "./view";

export default async function <T extends FastifyInstance>(fastify: T) {
  await prisma(fastify);
  await view(fastify);
  await _static(fastify);
  await cors(fastify);
  await rateLimit(fastify);
  await helmet(fastify);
  await compress(fastify);
  await cookies(fastify);
  await jwt(fastify);
  await swagger(fastify);
  await swaggerUi(fastify);
  await swaggerSplit(fastify);
  await emailPlugin(fastify, {});
  // await client(fastify);
  await autoload(fastify);
  await permission(fastify);
  await calculateDistance(fastify, {});
  // await scheduling(fastify, {
  //   name: "scheduling-plugin",
  // });
  // await notificationsPlugin(fastify, {
  //   name: "notifications-plugin",
  // });
}
