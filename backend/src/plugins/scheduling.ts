// import { FastifyPluginAsync } from "fastify";
// import fp from "fastify-plugin";
// import { gracefulShutdown } from "node-schedule";
// import { SchedulingService } from "src/services/scheduling.service";

// declare module "fastify" {
//   interface FastifyInstance {
//     schedulingService: SchedulingService;
//   }
// }

// const schedulingPlugin: FastifyPluginAsync = async (fastify) => {
//   const schedulingService = new SchedulingService(fastify);

//   fastify.decorate("schedulingService", schedulingService);

//   fastify.addHook("onReady", async () => {
//     await fastify.schedulingService.startSchedulers();
//     fastify.log.info("Scheduling service started");
//   });

//   fastify.addHook("onClose", async () => {
//     await gracefulShutdown();
//     fastify.log.info("Scheduling service stopped");
//   });
// };

// export default fp(schedulingPlugin, {
//   name: "scheduling-plugin",
// });
