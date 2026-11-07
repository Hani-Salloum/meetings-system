import fastifyHelmet from "@fastify/helmet";
import { FastifyInstance } from "fastify";

export default async function <T extends FastifyInstance>(fastify: T) {
  await fastify.register(fastifyHelmet);
}
