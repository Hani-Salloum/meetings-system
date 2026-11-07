import { FastifyInstance } from "fastify";
import { verifyToken } from "src/utils/verify-token";

export default async function (fastify: FastifyInstance) {
  verifyToken(fastify);
}
