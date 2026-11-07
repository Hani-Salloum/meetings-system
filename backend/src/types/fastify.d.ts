import { PrismaClient } from "@prisma/client";
import { AxiosInstance } from "axios";
import "fastify";
import Redis from "ioredis";
import { permissionsType } from "src/constants/permissions";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
    redis: Redis;
    client: AxiosInstance;
  }

  interface FastifySchema {
    permissions?: (keyof permissionsType)[]
  }
}
