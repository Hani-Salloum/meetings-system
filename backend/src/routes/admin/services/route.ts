import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import getDataHandler from "src/lib/fetch-paginated-data";
import { z } from "zod";

// Schema for creating a new service
export const createServiceSchema = z.object({
  ar_name: z.string().min(2, "Arabic name must be at least 2 characters"),
  en_name: z.string().min(2, "English name must be at least 2 characters"),
  ar_description: z.string().optional(),
  en_description: z.string().optional(),
});

// Schema for updating a service
export const updateServiceSchema = z.object({
  ar_name: z.string().min(2, "Arabic name must be at least 2 characters").optional(),
  en_name: z.string().min(2, "English name must be at least 2 characters").optional(),
  ar_description: z.string().optional(),
  en_description: z.string().optional(),
});

// Schema for service ID parameter
export const serviceIdParamsSchema = z.object({
  id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive("Service ID must be a positive integer")),
});

export default async function (fastify: FastifyInstance) {
  // Get all services with pagination, filtering, and sorting
  getDataHandler({
    fastify,
    tableName: "service",
    permission: ["service:read-all"],
    tags: ["services"],
    findArgs: {
      include: {
        _count: {
          select: {
            meetingRequestPages: true,
          },
        },
      },
    },
    refactorResult: async ({ data }) => {
      // Add meeting request pages count to each service
      return data.map((service: any) => ({
        ...service,
        meeting_request_pages_count: service._count?.meetingRequestPages || 0,
        _count: undefined, // Remove the _count object
      }));
    },
  });

  // Get single service by ID
  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/:id",
    {
      schema: {
        params: serviceIdParamsSchema,
        permissions: ["service:read"],
        tags: ["services"],
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const service = await fastify.prisma.service.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              meetingRequestPages: true,
            },
          },
        },
      });

      if (!service) {
        return reply.status(404).send({
          success: false,
          message: "Service not found",
          data: null,
        });
      }

      // Add meeting request pages count to the service
      const serviceWithCount = {
        ...service,
        meeting_request_pages_count: service._count?.meetingRequestPages || 0,
        _count: undefined, // Remove the _count object
      };

      return reply.send({
        success: true,
        message: "Service retrieved successfully",
        data: serviceWithCount,
      });
    },
  );

  // Create new service
  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/",
    {
      schema: {
        body: createServiceSchema,
        permissions: ["service:create"],
        tags: ["services"],
      },
    },
    async (request, reply) => {
      const serviceData = request.body;

      // Check if service with same names already exists
      const existingService = await fastify.prisma.service.findFirst({
        where: {
          OR: [{ ar_name: serviceData.ar_name }, { en_name: serviceData.en_name }],
        },
      });

      if (existingService) {
        return reply.status(400).send({
          success: false,
          message: "Service with this name already exists",
          data: null,
        });
      }

      // Create service
      const newService = await fastify.prisma.service.create({
        data: {
          ar_name: serviceData.ar_name,
          en_name: serviceData.en_name,
          ar_description: serviceData.ar_description,
          en_description: serviceData.en_description,
        },
      });

      return reply.status(201).send({
        success: true,
        message: "Service created successfully",
        data: {
          ...newService,
          meeting_request_pages_count: 0,
        },
      });
    },
  );

  // Update service
  fastify.withTypeProvider<ZodTypeProvider>().put(
    "/:id",
    {
      schema: {
        params: serviceIdParamsSchema,
        body: updateServiceSchema,
        permissions: ["service:update"],
        tags: ["services"],
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const updateData = request.body;

      // Check if service exists
      const existingService = await fastify.prisma.service.findUnique({
        where: { id },
      });

      if (!existingService) {
        return reply.status(404).send({
          success: false,
          message: "Service not found",
          data: null,
        });
      }

      // Check if names are being updated and if they already exist
      if (updateData.ar_name && updateData.ar_name !== existingService.ar_name) {
        const arNameExists = await fastify.prisma.service.findFirst({
          where: {
            ar_name: updateData.ar_name,
            id: { not: id },
          },
        });

        if (arNameExists) {
          return reply.status(400).send({
            success: false,
            message: "Service with this Arabic name already exists",
            data: null,
          });
        }
      }

      if (updateData.en_name && updateData.en_name !== existingService.en_name) {
        const enNameExists = await fastify.prisma.service.findFirst({
          where: {
            en_name: updateData.en_name,
            id: { not: id },
          },
        });

        if (enNameExists) {
          return reply.status(400).send({
            success: false,
            message: "Service with this English name already exists",
            data: null,
          });
        }
      }

      // Prepare update data
      const dataToUpdate: Record<string, unknown> = {};
      if (updateData.ar_name !== undefined) dataToUpdate.ar_name = updateData.ar_name;
      if (updateData.en_name !== undefined) dataToUpdate.en_name = updateData.en_name;
      if (updateData.ar_description !== undefined)
        dataToUpdate.ar_description = updateData.ar_description;
      if (updateData.en_description !== undefined)
        dataToUpdate.en_description = updateData.en_description;

      // Update service
      const updatedService = await fastify.prisma.service.update({
        where: { id },
        data: dataToUpdate,
      });

      return reply.send({
        success: true,
        message: "Service updated successfully",
        data: {
          ...updatedService,
          meeting_request_pages_count: 0, // Will be updated if needed
        },
      });
    },
  );

  // Delete service
  fastify.withTypeProvider<ZodTypeProvider>().delete(
    "/:id",
    {
      schema: {
        params: serviceIdParamsSchema,
        permissions: ["service:delete"],
        tags: ["services"],
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      // Check if service exists
      const existingService = await fastify.prisma.service.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              meetingRequestPages: true,
            },
          },
        },
      });

      if (!existingService) {
        return reply.status(404).send({
          success: false,
          message: "Service not found",
          data: null,
        });
      }

      // Check if service has any related meeting request pages
      if (existingService._count.meetingRequestPages > 0) {
        return reply.status(400).send({
          success: false,
          message: "Cannot delete service. Service has related meeting request pages.",
          data: null,
        });
      }

      // Delete service
      await fastify.prisma.service.delete({
        where: { id },
      });

      return reply.send({
        success: true,
        message: "Service deleted successfully",
        data: null,
      });
    },
  );

  // Get service statistics
  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/:id/statistics",
    {
      schema: {
        params: serviceIdParamsSchema,
        permissions: ["service:read"],
        tags: ["services"],
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      // Check if service exists
      const existingService = await fastify.prisma.service.findUnique({
        where: { id },
      });

      if (!existingService) {
        return reply.status(404).send({
          success: false,
          message: "Service not found",
          data: null,
        });
      }

      // Get service statistics
      const [meetingRequestPagesCount, totalServices] = await Promise.all([
        fastify.prisma.meetingRequestPage.count({
          where: { service_id: id },
        }),
        fastify.prisma.service.count(),
      ]);

      return reply.send({
        success: true,
        message: "Service statistics retrieved successfully",
        data: {
          service_id: id,
          meeting_request_pages_count: meetingRequestPagesCount,
          total_services: totalServices,
          service_usage_percentage:
            totalServices > 0 ? ((meetingRequestPagesCount / totalServices) * 100).toFixed(2) : "0",
        },
      });
    },
  );
}
