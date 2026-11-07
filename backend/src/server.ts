import { fastify } from "src/app";
import env from "./config/env";

const PORT = Number(env.PORT) || 3003;

const start = async () => {
  try {
    fastify.log.info("before running server...");
    const date = new Date();
    await fastify.listen({ port: PORT, host: "0.0.0.0" });
    fastify.log.info(
      `Server running on http://localhost:${PORT} in ${new Date().getTime() - date.getTime()} ms`,
    );
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
