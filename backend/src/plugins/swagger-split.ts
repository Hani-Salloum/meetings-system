import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export default async function <T extends FastifyInstance>(fastify: T) {
  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/documentation/:path",
    {
      schema: {
        params: z.object({
          path: z.string(),
        }),
        hide: true,
      },
    },
    async (request, reply) => {
      const swaggerApis = fastify.swagger();
      const allPaths = swaggerApis?.paths;
      if (!allPaths) {
        return reply.status(404).send({ message: "No paths found" });
      }
      const paths = Object.entries(allPaths).filter(([path]) =>
        path.startsWith("/" + request.params.path),
      );
      return reply.send({
        ...swaggerApis,
        paths: Object.fromEntries(paths),
        info: {
          ...swaggerApis.info,
          description: `Documentation for ${request.params.path} section`,
        },
      });
    },
  );
}
