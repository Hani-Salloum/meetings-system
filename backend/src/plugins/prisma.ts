import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

const prismaPlugin = fp(async (fastify) => {
  const prisma = new PrismaClient();

  await prisma.$connect();

  // Make Prisma available through fastify.prisma
  fastify.decorate("prisma", prisma);

  fastify.addHook("onClose", async (fastify) => {
    await fastify.prisma.$disconnect();
  });
});

export default async function (fastify: FastifyInstance) {
  await fastify.register(prismaPlugin);
  // registerPrismaQuery(fastify);
}
