import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { permissions, permissionsType } from "src/constants/permissions";
import { z } from "zod";

interface RoutePermission {
  url: string;
  method: string;
  permissions: (keyof permissionsType)[];
}

export default async function <T extends FastifyInstance>(fastify: T) {
  // Store route permissions as they are registered
  const routePermissions: RoutePermission[] = [];

  // Hook to collect permissions when routes are added
  fastify.addHook("onRoute", (routeOptions) => {
    const permissions = routeOptions.schema?.permissions || [];
    if (permissions.length > 0) {
      if (routeOptions.method instanceof Array) {
        routeOptions.method.forEach((method: string) => {
          routePermissions.push({
            url: routeOptions.url,
            method: method,
            permissions: permissions,
          });
        });
      } else {
        routePermissions.push({
          url: routeOptions.url,
          method: routeOptions.method,
          permissions: permissions,
        });
      }
    }
  });

  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/url-permissions",
    {
      schema: {
        tags: ["permissions"],
        querystring: z.object({
          allPermissions: z.string().default("false"),
          urlPermissions: z.string().default("true"),
        }),
      },
    },
    async (request, reply) => {
      const allPermissions =
        request.query.allPermissions === "true" || request.query.allPermissions === "1";
      const urlPermissions =
        request.query.urlPermissions === "true" || request.query.urlPermissions === "1";
      return reply.send({
        allPermissions: allPermissions ? permissions : undefined,
        urlPermissions: urlPermissions ? routePermissions : undefined,
      });
    },
  );
}
