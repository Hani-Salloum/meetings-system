import fastifySwaggerUI from "@fastify/swagger-ui";
import { FastifyInstance } from "fastify";
import customSwagger from "./swaggerCustomization";

export default async function <T extends FastifyInstance>(fastify: T) {
  await fastify.register(fastifySwaggerUI, {
    routePrefix: "/documentation",
    uiConfig: {
      docExpansion: "none",
      deepLinking: true,
      persistAuthorization: true,
      filter: true,
      layout: "BaseLayout", // StandaloneLayout, BaseLayout
      tryItOutEnabled: true,
      displayRequestDuration: true,
      showExtensions: true,
      showCommonExtensions: true,
      showMutatedRequest: true,
      onComplete: customSwagger,
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next();
      },
      preHandler: function (request, reply, next) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  });
}
