import fastifyCors from "@fastify/cors";
import { FastifyInstance } from "fastify";

export default async function <T extends FastifyInstance>(fastify: T) {
  await fastify.register(fastifyCors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  });
}
