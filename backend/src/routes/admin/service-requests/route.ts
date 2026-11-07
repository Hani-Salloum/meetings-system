import { FastifyInstance } from "fastify";
import getDataHandler from "src/lib/fetch-paginated-data";

export default async function (fastify: FastifyInstance) {
  getDataHandler({
    fastify,
    tableName: "serviceRequest",
    permission: ["service-requests:read"],
    tags: ["service-requests"],
    handleFindArgs({ findArgs }) {
      return {
        findArgs: {
          ...findArgs,
          include: {
            clientProfile: true,
          },
        },
      };
    },
  });
}
