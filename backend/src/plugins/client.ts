import axios, { AxiosInstance } from "axios";
import { FastifyInstance, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import env from "../config/env";

declare module "fastify" {
  interface FastifyInstance {
    client: AxiosInstance;
    getClient: (request?: FastifyRequest) => AxiosInstance;
  }
}

const clientPlugin = fp(async (fastify) => {
  // Create base Axios instance with the main project domain
  const baseClient = axios.create({
    baseURL: env.BASE_PROJECT_DOMAIN,
    timeout: 10000, // 10 seconds timeout
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Create a client factory that can include authentication tokens
  const createAuthenticatedClient = (token?: string): AxiosInstance => {
    const client = axios.create({
      baseURL: env.BASE_PROJECT_DOMAIN,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        ...(token && { "x-service-token": token }),
      },
    });

    return client;
  };

  // Make the base client available through fastify.client
  fastify.decorate("client", baseClient);

  // Make the client factory available through fastify.getClient
  fastify.decorate("getClient", (request?: FastifyRequest): AxiosInstance => {
    if (!request) {
      return baseClient; // Return base client if no request context
    }

    // Extract token from request headers
    const authHeader = request.headers["x-service-token"] as string;
    let token: string | undefined;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7); // Remove "Bearer " prefix
    }

    // Return authenticated client if token exists, otherwise base client
    return createAuthenticatedClient(token);
  });
});

export default async function (fastify: FastifyInstance) {
  await fastify.register(clientPlugin);
}
