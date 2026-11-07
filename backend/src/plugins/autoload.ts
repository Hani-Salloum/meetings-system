import fastifyAutoload from "@fastify/autoload";
import { FastifyInstance } from "fastify";
import path from "path";

export default async function autoload(fastify: FastifyInstance) {
  fastify.register(fastifyAutoload, {
    dir: path.join(__dirname, "../routes"),
    indexPattern: /route\.(js|ts)$/,
    autoHooksPattern: /hook\.(js|ts)$/,
    autoHooks: true,
    cascadeHooks: true,
  });
}
