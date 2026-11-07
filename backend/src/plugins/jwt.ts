import jwt from "@fastify/jwt";
import { Prisma } from "@prisma/client";
import { FastifyInstance } from "fastify";
import env from "src/config/env";

// import { Prisma } from "@prisma/client";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { id: number };
    user: Prisma.UserGetPayload<{
      include: {
        user_types: {
          include: {
            permissions: true;
          };
        };
      };
    }> & {
      permissions: string[];
      auth_token: string;
    };
  }
}

export default async function <T extends FastifyInstance>(fastify: T) {
  await fastify.register(jwt, {
    secret: env.JWT_SECRET, // Provide default to avoid undefined
    cookie: {
      cookieName: "accessToken", // Optional: Store access token in a cookie
      signed: true, // Use signed cookies for security
    },
  });
}
