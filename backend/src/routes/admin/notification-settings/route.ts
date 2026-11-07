import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import getDataHandler from "src/lib/fetch-paginated-data";
import { z } from "zod";

export default async function (fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/",
    {
      schema: {
        tags: ["notification-settings"],
        permissions: ["notification-settings:update"],
        body: z.object({
          domain: z.string(),
          profiles: z.array(
            z
              .object({
                type: z.enum(["EMAIL", "WHATSAPP"]).default("EMAIL"),
                value: z.string().default("test@rs4it.sa"),
              })
              .refine(({ value, type }) => {
                const emailSchema = z.string().email();
                if (type === "EMAIL") return emailSchema.parse(value);
                return true;
              }),
          ),
        }),
      },
    },
    async (request, reply) => {
      const { domain, profiles } = request.body;

      // Find the service request page
      const pageNotificationSettings = await fastify.prisma.serviceRequestPage.findFirst({
        where: {
          domain,
        },
        include: {
          notificationProfiles: true,
        },
      });

      if (!pageNotificationSettings)
        return reply.status(404).send({
          message: "ServiceRequestPage not found",
          success: false,
        });

      // Start a transaction to update notification profiles
      await fastify.prisma.$transaction(async (tx) => {
        // Clear existing notification profiles for this page
        await tx.serviceRequestPage.update({
          where: { domain },
          data: {
            notificationProfiles: {
              set: [], // Remove all existing connections
            },
          },
        });

        // Create or find notification profiles and connect them
        const updatedProfiles = [];
        for (const profile of profiles) {
          // Find existing profile or create new one
          let notificationProfile = await tx.notificationProfile.findFirst({
            where: {
              type: profile.type,
              value: profile.value,
            },
          });

          if (!notificationProfile) {
            notificationProfile = await tx.notificationProfile.create({
              data: {
                type: profile.type,
                value: profile.value,
              },
            });
          }

          updatedProfiles.push(notificationProfile);
        }

        // Connect the profiles to the service request page
        await tx.serviceRequestPage.update({
          where: { domain },
          data: {
            notificationProfiles: {
              connect: updatedProfiles.map((profile) => ({ id: profile.id })),
            },
          },
        });

        return updatedProfiles;
      });

      // Fetch updated page with notification profiles
      const updatedPage = await fastify.prisma.serviceRequestPage.findFirst({
        where: { domain },
        include: {
          notificationProfiles: true,
        },
      });

      return reply.send({
        message: "Notification profiles updated successfully",
        success: true,
        data: updatedPage,
      });
    },
  );

  getDataHandler({
    fastify,
    tags: ["notification-settings"],
    permission: ["notification-settings:read-all"],
    tableName: "serviceRequestPage",
    handleFindArgs({ findArgs }) {
      return {
        findArgs: {
          ...findArgs,
          include: {
            notificationProfiles: true,
          },
        },
      };
    },
  });
}
