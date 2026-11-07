import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export default async function (fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/",
    {
      schema: {
        summary: "Get user data",
        tags: ["auth"],
      },
    },
    async (request, reply) => {
      const user = request.user;
      const userData = await fastify.prisma.user.update({
        where: {
          id: user.id,
          devices: {
            some: {
              auth_token: user.auth_token,
            },
          },
        },
        data: {
          devices: {
            delete: {
              auth_token: user.auth_token,
            },
          },
        },
      });
      return reply.status(200).send(userData);
    },
  );
}
