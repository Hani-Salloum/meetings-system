import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import getDataHandler from "src/lib/fetch-paginated-data";
import { z } from "zod";

const prisma = new PrismaClient();

// Schemas for validation
const createAvailabilitySchema = z.object({
  user_id: z.number().int().positive("User ID must be a positive integer"),
  week_day: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]),
  day_parts: z.array(
    z.enum([
      "HOUR_0",
      "HOUR_1",
      "HOUR_2",
      "HOUR_3",
      "HOUR_4",
      "HOUR_5",
      "HOUR_6",
      "HOUR_7",
      "HOUR_8",
      "HOUR_9",
      "HOUR_10",
      "HOUR_11",
      "HOUR_12",
      "HOUR_13",
      "HOUR_14",
      "HOUR_15",
      "HOUR_16",
      "HOUR_17",
      "HOUR_18",
      "HOUR_19",
      "HOUR_20",
      "HOUR_21",
      "HOUR_22",
      "HOUR_23",
    ]),
  ),
});

const updateAvailabilitySchema = createAvailabilitySchema
  .partial()
  .omit({ user_id: true, week_day: true });

export default async function (fastify: FastifyInstance) {
  // Create new availability
  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/",
    {
      schema: {
        description: "Create new employee availability",
        tags: ["availability"],
        permissions: ["availability:manage"],
        body: createAvailabilitySchema,
      },
    },
    async (request, reply) => {
      const { user_id, week_day, day_parts } = request.body;

      // Check if availability already exists for this user and day
      const existingAvailability = await prisma.employeesAvailability.findUnique({
        where: {
          user_id_week_day: {
            user_id,
            week_day,
          },
        },
      });

      if (existingAvailability) {
        return reply.code(400).send({
          message: "Availability already exists for this user and day",
          error: "DUPLICATE_AVAILABILITY",
        });
      }

      // Create availability with hours
      const availability = await prisma.employeesAvailability.create({
        data: {
          user_id,
          week_day,
          employeesAvailabilityHours: {
            create: day_parts.map((day_part) => ({
              day_part,
            })),
          },
        },
        include: {
          employeesAvailabilityHours: true,
        },
      });

      return reply.code(201).send({
        message: "Availability created successfully",
        data: {
          id: availability.id,
          user_id: availability.user_id,
          week_day: availability.week_day,
          day_parts: availability.employeesAvailabilityHours.map((h) => h.day_part),
          created_at: availability.created_at.toISOString(),
          updated_at: availability.updated_at.toISOString(),
        },
      });
    },
  );

  // Get availability (with optional filters) using getDataHandler
  getDataHandler({
    fastify,
    tableName: "employeesAvailability",
    tags: ["availability"],
    summary: "Get all employee availability with pagination and filters",
    permission: ["availability:read-all"],
    allowedFilterFields: ["user_id", "week_day"],
    allowedSortFields: ["user_id", "week_day", "created_at", "updated_at"],
    handleFindArgs({ findArgs }) {
      return {
        findArgs: {
          ...findArgs,
          include: {
            employeesAvailabilityHours: true,
          },
        },
      };
    },
    refactorResult({ data }) {
      const formattedData = data.map((availability) => ({
        id: availability.id,
        user_id: availability.user_id,
        week_day: availability.week_day,
        // @ts-expect-error - that is included from the handleFindArgs
        day_parts: availability.employeesAvailabilityHours.map((h) => h.day_part),
        created_at: availability.created_at.toISOString(),
        updated_at: availability.updated_at.toISOString(),
      }));

      return {
        data: formattedData,
      };
    },
  });

  // Update availability
  fastify.withTypeProvider<ZodTypeProvider>().put(
    "/:id",
    {
      schema: {
        description: "Update employee availability",
        tags: ["availability"],
        permissions: ["availability:manage"],
        params: z.object({
          id: z.coerce.number().int().positive("Availability ID must be a positive integer"),
        }),
        body: updateAvailabilitySchema,
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const updateData = request.body;

      // Check if availability exists
      const existingAvailability = await prisma.employeesAvailability.findUnique({
        where: { id },
      });

      if (!existingAvailability) {
        return reply.code(404).send({
          message: "Availability not found",
          error: "NOT_FOUND",
        });
      }

      // Update availability
      const updatedAvailability = await prisma.employeesAvailability.update({
        where: { id },
        data: {
          ...(updateData.day_parts && {
            employeesAvailabilityHours: {
              deleteMany: {},
              create: updateData.day_parts.map((day_part) => ({
                day_part,
              })),
            },
          }),
        },
        include: {
          employeesAvailabilityHours: true,
        },
      });

      return reply.send({
        message: "Availability updated successfully",
        data: {
          id: updatedAvailability.id,
          user_id: updatedAvailability.user_id,
          week_day: updatedAvailability.week_day,
          day_parts: updatedAvailability.employeesAvailabilityHours.map((h) => h.day_part),
          created_at: updatedAvailability.created_at.toISOString(),
          updated_at: updatedAvailability.updated_at.toISOString(),
        },
      });
    },
  );

  // Get availability by user ID
  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/user/:user_id",
    {
      schema: {
        description: "Get all availability for a specific user",
        tags: ["availability"],
        permissions: ["availability:manage"],
        params: z.object({
          user_id: z.coerce.number().int().positive("User ID must be a positive integer"),
        }),
      },
    },
    async (request, reply) => {
      const { user_id } = request.params;

      const user = await prisma.user.findUnique({
        where: { id: user_id },
      });

      const availabilities = await prisma.employeesAvailability.findMany({
        where: { user_id },
        include: {
          employeesAvailabilityHours: true,
        },
        orderBy: { week_day: "asc" },
      });

      const formattedData = availabilities.map((availability) => ({
        id: availability.id,
        week_day: availability.week_day,
        day_parts: availability.employeesAvailabilityHours.map((h) => h.day_part),
        created_at: availability.created_at.toISOString(),
        updated_at: availability.updated_at.toISOString(),
      }));

      return reply.send({
        message: "User availability retrieved successfully",
        data: { user, employeesAvailability: formattedData },
      });
    },
  );
}
