import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  FindArgsType,
  GetDataHandler,
  HandleFindArgs,
  TableName,
} from "src/types/fetch-paginated-data";
import { correctJSONString } from "src/utils/json-utils";
// import { verifyPermission } from "src/utils/verify-permission";
import { z } from "zod";
import { paginationSchema } from "./prisma-query/pagination-schemas";
import { buildWhereClause } from "./prisma-query/utils/filter-parser";
import { buildPrismaOrderBy } from "./prisma-query/utils/sorting";

const getDataHandler = <
  T extends TableName,
  F extends FindArgsType<T>,
  HF extends HandleFindArgs<T>,
>({
  allowedSortFields,
  tags,
  summary,
  apiName,
  fastify,
  permission,
  tableName,
  findArgs,
  handleFindArgs,
  path,
  paramsSchema,
  afterFind,
  refactorResult,
}: GetDataHandler<T, F, HF>) =>
  fastify.withTypeProvider<ZodTypeProvider>().get(
    path || "/",
    {
      schema: {
        tags: tags ? tags : [apiName || ""],
        summary: summary || `Get all ${apiName}`,
        permissions: permission || [],
        querystring: paginationSchema,
        params: paramsSchema || z.object({}),
      },
    },
    async (request, reply) => {
      // verifyPermission({ permission: permission, reply, request });

      const params = paginationSchema.parse(request.query);
      const { page, pagesize, filters, sort, search, joinOperator } = params;

      const parsedFilters = JSON.parse(correctJSONString(filters));
      const parsedSort = JSON.parse(correctJSONString(sort));

      const where = buildWhereClause({
        filters: filters ? parsedFilters : [],
        prisma: fastify.prisma,
        tableName,
        search,
        allowedFilterFields: [],
        joinOperator,
      });

      const _allowedSortFields = Object.values(fastify.prisma[tableName].fields)
        .map((field) => field.name)
        .filter((item) => (allowedSortFields ? allowedSortFields?.includes(item.name) : true));

      const orderBy = buildPrismaOrderBy(parsedSort, _allowedSortFields);

      const mergedFindArgs = {
        skip: (Number(page) - 1) * Number(pagesize),
        take: Number(pagesize),
        where,
        orderBy,
        ...findArgs,
      };
      const finalFindArgs = handleFindArgs
        ? handleFindArgs({ request, findArgs: mergedFindArgs, parsedFilters }).findArgs
        : mergedFindArgs;

      const [data, total] = await Promise.all([
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (fastify.prisma[tableName] as any).findMany(finalFindArgs),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (fastify.prisma as any)[tableName].count({ where: finalFindArgs?.where }),
      ]);

      if (afterFind) {
        await afterFind({
          request,
          data,
          prisma: fastify.prisma,
        });
      }

      return reply.send({
        data: refactorResult
          ? await refactorResult({ request, data, prisma: fastify.prisma, fastify, reply })
          : data,
        meta: {
          total,
          page: Number(page),
          pageSize: Number(pagesize),
          totalPages: Math.ceil(total / Number(pagesize)),
        },
      });
    },
  );

export default getDataHandler;
