import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import getDataHandler from "src/lib/fetch-paginated-data";
import { z } from "zod";

export const toggleClientBlockParamsSchema = z.object({
  id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive("Client ID must be a positive integer")),
});

export default async function (fastify: FastifyInstance) {
  getDataHandler({
    fastify,
    tableName: "clientProfile",
    permission: ["client:read-all"],
    tags: ["client-profile"],
  });

  // Toggle client block status route
  fastify.withTypeProvider<ZodTypeProvider>().put(
    "/:id/block",
    {
      schema: {
        params: toggleClientBlockParamsSchema,
        permissions: ["client:toggle-block"],
        tags: ["client-profile"],
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      // Check if client exists
      const existingClient = await fastify.prisma.clientProfile.findUnique({
        where: { id },
      });

      if (!existingClient) {
        return reply.status(404).send({
          success: false,
          message: "Client not found",
          data: null,
        });
      }

      if (existingClient.ip === "unknown") {
        return reply.status(400).send({
          success: false,
          message: "Client IP is unknown",
          data: null,
        });
      }

      const isCurrentlyBlocked = existingClient.status === "BLOCKED";
      const newStatus = isCurrentlyBlocked ? "ACTIVE" : "BLOCKED";

      // Prepare update data
      const updateData: {
        status: "ACTIVE" | "BLOCKED";
      } = {
        status: newStatus,
      };

      // Update the client status
      const updatedClient = await fastify.prisma.clientProfile.update({
        where: { id },
        data: updateData,
      });

      const action = isCurrentlyBlocked ? "unblocked" : "blocked";
      const message = `Client ${action} successfully`;

      return reply.send({
        success: true,
        message,
        data: {
          id: updatedClient.id,
          name: updatedClient.name,
          email: updatedClient.email,
          status: updatedClient.status,
          blocked_at: undefined, // Will be available after schema update
          block_reason: undefined, // Will be available after schema update
        },
      });
    },
  );
}
