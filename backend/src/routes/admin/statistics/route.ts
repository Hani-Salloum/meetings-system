import { FastifyInstance } from "fastify";

export default async function (fastify: FastifyInstance) {
  fastify.get(
    "/",
    {
      schema: {
        tags: ["statistics"],
        permissions: ["statistics:read"],
      },
    },
    async (request, reply) => {
      const meetingCount = await fastify.prisma.meeting.count();
      const meetingCountRequested = await fastify.prisma.meeting.count({
        where: {
          status: "REQUESTED",
        },
      });
      const programmer_count = await fastify.prisma.user.count();

      return reply.status(200).send({
        meeting_count: meetingCount,
        pending_meeting_count: meetingCountRequested,
        programmer_count,
      });
    },
  );
}
