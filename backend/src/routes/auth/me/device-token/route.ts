import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

const tokenSchema = z.object({
  token: z.string().nonempty("Device token is required"),
});

export default async function (fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/save-token",
    {
      schema: {
        summary: "Save Device Token",
        tags: ["auth"],
        operationId: "saveToken",
        body: tokenSchema,
      },
    },
    async (request, reply) => {
      const { token } = request.body;
      const userId = request.user.id;
      const auth_token = request.user.auth_token;

      if (!userId) return reply.status(400).send({ error: "User not found" });

      // تخزين الرمز أو تحديثه إذا كان موجودًا
      await fastify.prisma.user.update({
        where: { id: userId },
        data: {
          devices: {
            update: {
              where: {
                auth_token,
              },
              data: {
                fcmTokens: token,
              },
            },
          },
        },
      });

      return reply.send({ message: "Token saved successfully" });
    },
  );
}
