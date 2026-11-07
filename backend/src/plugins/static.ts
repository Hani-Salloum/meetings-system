import fastifyStatic from "@fastify/static";
import { FastifyInstance } from "fastify";
import path from "path";

export default async function <T extends FastifyInstance>(fastify: T) {
  await fastify.register(fastifyStatic, {
    root: path.join(__dirname, "../../public"),
    prefix: "/public/",
  });
}
