import fastifyCompress from "@fastify/compress";
import { FastifyInstance } from "fastify";
export default async function <T extends FastifyInstance>(fastify: T) {
  await fastify.register(fastifyCompress, {
    global: true,
    threshold: 1024,
  });
}
