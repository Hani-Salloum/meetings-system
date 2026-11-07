import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import i18next from "../../../config/i18n";
import { HttpConstant } from "../../../constants/HttpConstant";
import { CustomError } from "../../../utils/custom-error";

export default async function (fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/",
    {
      schema: {
        summary: "Get user data",
        tags: ["auth"],
        querystring: z.object({
          device_token: z.string().optional(),
        }),
      },
    },
    async (request, reply) => {
      const user = request.user;
      const device_token = request.query?.device_token;

      const existingUser = await fastify.prisma.user.findFirst({
        where: {
          id: user.id,
        },
      });

      if (!existingUser) {
        throw new CustomError({
          message: i18next.t("error.user_not_found"),
          statusCode: HttpConstant.NOT_FOUND,
          code: "USER_NOT_FOUND",
        });
      }

      const existingDevice = await fastify.prisma.device.findFirst({
        where: {
          user_id: user.id,
          auth_token: user.auth_token,
        },
      });

      if (!existingDevice) {
        throw new CustomError({
          message: i18next.t("error.session_expired"),
          statusCode: HttpConstant.UNAUTHORIZED,
          code: "SESSION_EXPIRED",
        });
      }

      const userData = await fastify.prisma.user.update({
        where: {
          id: user.id,
          devices: {
            some: {
              auth_token: user.auth_token,
            },
          },
        },
        omit: {
          password: true,
          reset_password_code: true,
        },
        include: {
          user_types: {
            include: {
              permissions: true,
            },
          },
          // programmers: true,
        },
        data: device_token
          ? {
              active: true,
              devices: {
                deleteMany: {
                  fcmTokens: device_token,
                },
                update: {
                  where: { auth_token: user.auth_token },
                  data: {
                    fcmTokens: device_token,
                  },
                },
              },
            }
          : {
              active: true,
            },
      });
      return reply.status(200).send(userData);
    },
  );
}
