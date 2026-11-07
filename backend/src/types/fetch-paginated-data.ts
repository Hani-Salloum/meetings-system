import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs, Omit } from "@prisma/client/runtime/library";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { permissionsType } from "src/constants/permissions";
import { z } from "zod";

type _Prisma = PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
export type TableName = {
  [K in keyof _Prisma]: _Prisma[K] extends { findMany: unknown } ? K : never;
}[keyof _Prisma];
type getDataType<T extends TableName, Params extends FindArgsType<T>> = Prisma.Result<
  _Prisma[T],
  Params,
  "findMany"
>;

export type FindArgsType<T extends TableName> = Omit<
  Parameters<_Prisma[T]["findMany"]>[0],
  "orderBy" | "where"
>;

export type HandleFindArgs<
  T extends TableName,
  F = Parameters<_Prisma[T]["findMany"]>[0],
> = (params: { request: FastifyRequest; findArgs: F; parsedFilters: Record<string, unknown> }) => {
  findArgs: F;
};

export type GetDataHandler<
  T extends TableName,
  F extends FindArgsType<T>,
  HF extends HandleFindArgs<T>,
> = {
  fastify: FastifyInstance;
  tags?: string[];
  summary?: string;
  apiName?: string;
  tableName: T;
  findArgs?: F;
  allowedFilterFields?: (keyof _Prisma[T]["fields"])[];
  allowedSortFields?: (keyof _Prisma[T]["fields"])[];
  permission: (keyof permissionsType)[];
  /**
   * A function that take allow you to modify the findArgs final findMany args
   * the fastify request object
   * @param params.request
   * the prisma findWhere args after merging all params including the custom findArgs
   * @param params.findArgs
   * @returns
   */
  handleFindArgs?: HF;
  path?: string;
  paramsSchema?: z.ZodSchema;
  afterFind?: (params: {
    request: FastifyRequest;
    data: getDataType<T, F>;
    prisma: _Prisma;
  }) => Promise<void> | void;
  refactorResult?: ({
    request,
    data,
    prisma,
    fastify,
  }: {
    request: FastifyRequest;
    data: getDataType<T, F>;
    prisma: _Prisma;
    fastify: FastifyInstance;
    reply: FastifyReply;
  }) => unknown;
};
