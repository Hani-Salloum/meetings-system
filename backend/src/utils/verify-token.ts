import { FastifyInstance } from "fastify";
import { t } from "i18next";
import jwt from "jsonwebtoken";
import env from "src/config/env";

interface DecodedToken {
  id: number;
  role: number;
}

export function verifyTokenSocket(token: string): Promise<DecodedToken> {
  return new Promise((resolve, reject) => {
    const secret = env.JWT_SECRET;
    jwt.verify(token, secret as string, (err, decoded) => {
      if (err) {
        reject(new Error("Invalid token"));
      } else {
        resolve(decoded as DecodedToken);
      }
    });
  });
}

export async function verifyToken(fastify: FastifyInstance) {
  fastify.addHook("preHandler", async (request, reply) => {
    try {
      const token_payload = (await request.jwtVerify()) as { id: number };
      const user = await fastify.prisma.user.update({
        where: {
          id: Number(token_payload.id),
          devices: {
            some: {
              auth_token: request.user.auth_token,
            },
          },
        },
        include: {
          user_types: {
            include: {
              permissions: true,
            },
          },
        },
        data: {
          available: true,
        },
      });

      if (!user) {
        return reply.status(401).send({ message: t("error.unauthorized_access") });
      }
      if (!user.active) {
        return reply.status(401).send({ message: t("user_not_active") });
      }

      // await fastify.schedulingService.scheduleUserAvailabilityCheck(user.id);

      const _user = {
        ...user,
        permissions:
          user?.user_types?.flatMap((userType) =>
            userType.permissions.map((permission) => permission.code),
          ) || [],
        auth_token: request.headers.authorization!.replace("Bearer ", ""),
      };
      request.user = _user;
    } catch (error) {
      fastify.log.error(error);
      return reply.status(401).send({ message: t("error.unauthorized_access") });
    }
  });
}
