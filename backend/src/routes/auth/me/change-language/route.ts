import { UserLanguage } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export default async function (fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/",
    {
      schema: {
        summary: "Get user data",
        tags: ["auth"],
        body: z.object({
          language: z.nativeEnum(UserLanguage),
        }),
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
          language: request.body.language,
        },
      });
      return reply.status(200).send(userData);
    },
  );
}
