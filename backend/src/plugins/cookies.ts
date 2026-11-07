import fastifyCookie from "@fastify/cookie";
import { FastifyInstance } from "fastify";
import env from "src/config/env";

export default async function (fastify: FastifyInstance) {
  await fastify.register(fastifyCookie, {
    secret: env.COOKIE_SECRET, // For signing cookies
    hook: "onRequest", // Cookies parsed on every request
  });
}
