import fastifyRateLimit from "@fastify/rate-limit";
import { FastifyInstance } from "fastify";

export default async function <T extends FastifyInstance>(fastify: T) {
  await fastify.register(fastifyRateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });
}
