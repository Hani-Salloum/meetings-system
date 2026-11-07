import fastifySwagger from "@fastify/swagger";
import { FastifyInstance } from "fastify";
import { jsonSchemaTransform } from "fastify-type-provider-zod";

export default async function <T extends FastifyInstance>(fastify: T) {
  await fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: "fastify-template",
        version: "1.0.0",
      },
      security: [
        {
          bearerAuth: [],
          refreshToken: [],
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
          refreshToken: {
            type: "apiKey",
            in: "cookie",
            name: "refreshToken",
          },
        },
      },
    },
    transform: ({ route, schema, url }) => {
      schema.tags = schema.tags?.map((tag) => tag.toLowerCase());
      if (schema.consumes?.includes("multipart/form-data")) {
        return {
          schema,
          url,
          route,
        };
      } else {
        return jsonSchemaTransform({
          schema,
          url,
        });
      }
    },
  });
}
