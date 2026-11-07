import fastifyView from "@fastify/view";
import ejs from "ejs";
import { FastifyInstance } from "fastify";
import path from "path";

export default async function (fastify: FastifyInstance) {
  fastify.register(fastifyView, {
    engine: {
      ejs,
    },
    root: path.join(__dirname, "..", "..", "views"),
    viewExt: "ejs",
    layout: path.join("layout", "main.ejs"),
    includeViewExtension: true,
  });
}
