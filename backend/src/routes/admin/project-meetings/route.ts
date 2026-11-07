import { FastifyInstance } from "fastify";
import getDataHandler from "src/lib/fetch-paginated-data";
import { z } from "zod";

// Request/Response schemas
export const createProjectMeetingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  pathname: z.string().min(1, "Pathname is required"),
  service_id: z.number().int().positive("Project ID must be a positive integer"),
  description: z.string().optional(),
  image: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  duration: z.number().int().positive("Duration must be a positive integer"),
  maximum_attendees: z.number().int().positive("Maximum attendees must be a positive integer"),
  participant_groups: z
    .array(
      z.object({
        employees: z
          .array(
            z.object({
              employee_id: z.number().int().positive("Employee ID must be a positive integer"),
              required: z.boolean().default(true),
            }),
          )
          .min(1, "At least one employee is required"),
      }),
    )
    .optional(),
});

export const updateProjectMeetingSchema = createProjectMeetingSchema.partial();

export default async function (fastify: FastifyInstance) {
  // Create project meeting
  fastify.post(
    "/",
    {
      schema: {
        body: createProjectMeetingSchema,
        permissions: ["project-meeting:create"],
        tags: ["project-meetings"],
      },
    },
    async (request, reply) => {
      const body = request.body as z.infer<typeof createProjectMeetingSchema>;

      await fastify.prisma.user.findMany({
        where: {
          id: {
            in:
              body.participant_groups?.flatMap((group) =>
                group.employees.map((employee) => employee.employee_id),
              ) ?? [],
          },
        },
      });

      // Create the meeting page
      const projectMeeting = await fastify.prisma.meetingRequestPage.create({
        data: {
          title: body.title,
          pathname: body.pathname,
          service_id: body.service_id,
          description: body.description,
          image: body.image,
          status: body.status,
          duration: body.duration,
          maximum_attendees: body.maximum_attendees,
        },
      });

      // Create participant groups if provided
      if (body.participant_groups && body.participant_groups.length > 0) {
        for (const group of body.participant_groups) {
          const participantGroup = await fastify.prisma.meetingParticipantGroup.create({
            data: {
              meeting_request_page_id: projectMeeting.id,
            },
          });

          // Create employee associations
          for (const employee of group.employees) {
            await fastify.prisma.meetingMeetingParticipantGroupEmployee.create({
              data: {
                meeting_meeting_participant_group_id: participantGroup.id,
                employee_id: employee.employee_id,
                required: employee.required,
              },
            });
          }
        }
      }

      return reply.code(201).send(projectMeeting);
    },
  );

  getDataHandler({
    fastify,
    tableName: "meetingRequestPage",
    permission: ["project-meeting:read-all"],
    tags: ["project-meetings"],
    handleFindArgs: ({ findArgs }) => {
      return {
        findArgs: {
          ...findArgs,
          include: {
            meetingParticipantGroups: {
              include: {
                meetingMeetingParticipantGroupEmployees: {
                  include: { meetingMeetingParticipantGroup: true },
                },
              },
            },
          },
        },
      };
    },
    async refactorResult({ data, fastify }) {
      const employees = await fastify.prisma.user.findMany();
      console.log({ employees });
      return {
        data: {
          meeting_pages: data,
          employees,
        },
      };
    },
  });

  // Update project meeting
  fastify.put(
    "/:id",
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
        body: updateProjectMeetingSchema,
        permissions: ["project-meeting:update"],
        tags: ["project-meetings"],
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const body = request.body as z.infer<typeof updateProjectMeetingSchema>;

      const existingMeeting = await fastify.prisma.meetingRequestPage.findUnique({
        where: { id: parseInt(id) },
      });

      if (!existingMeeting) {
        return reply.code(404).send({
          error: "NotFound",
          message: "Project meeting not found",
        });
      }

      // Extract participant_groups from body to handle separately
      const { participant_groups, ...updateData } = body;

      // Update the meeting page
      const updatedMeeting = await fastify.prisma.meetingRequestPage.update({
        where: { id: parseInt(id) },
        data: updateData,
      });

      // Handle participant groups if provided
      if (participant_groups) {
        // Delete all existing participant groups and their employees
        await fastify.prisma.meetingMeetingParticipantGroupEmployee.deleteMany({
          where: {
            meetingMeetingParticipantGroup: {
              meeting_request_page_id: updatedMeeting.id,
            },
          },
        });
        await fastify.prisma.meetingParticipantGroup.deleteMany({
          where: { meeting_request_page_id: updatedMeeting.id },
        });
        // Create all participant groups at once
        for (const participant_group of participant_groups) {
          await fastify.prisma.meetingParticipantGroup.create({
            data: {
              meeting_request_page_id: updatedMeeting.id,
              meetingMeetingParticipantGroupEmployees: {
                create: participant_group.employees.map((employee) => ({
                  employee_id: employee.employee_id,
                  required: employee.required,
                })),
              },
            },
          });
        }
        // // Get the created groups to get their IDs
        // const createdGroups = await fastify.prisma.projectsMeetingParticipantGroup.findMany({
        //   where: { projects_request_page_id: updatedMeeting.id },
        //   orderBy: { id: "asc" },
        // });
        // // Create all employee associations at once
        // const employeeAssociations = participant_groups.flatMap((group, groupIndex) =>
        //   group.employees.map((employee) => ({
        //     project_meeting_participant_group_id: createdGroups[groupIndex].id,
        //     employee_id: employee.employee_id,
        //     required: employee.required,
        //   })),
        // );
        // if (employeeAssociations.length > 0) {
        //   await fastify.prisma.projectsMeetingParticipantGroupEmployee.createMany({
        //     data: employeeAssociations,
        //   });
        // }
      }

      const meeting = await fastify.prisma.meetingRequestPage.findUnique({
        where: { id: parseInt(id) },
        include: {
          meetingParticipantGroups: {
            include: {
              meetingMeetingParticipantGroupEmployees: true,
            },
          },
        },
      });

      return reply.send(meeting);
    },
  );

  // Delete project meeting
  fastify.delete(
    "/:id",
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),

        permissions: ["project-meeting:delete"],
        tags: ["project-meetings"],
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      const existingMeeting = await fastify.prisma.meetingRequestPage.findUnique({
        where: { id: parseInt(id) },
      });

      if (!existingMeeting) {
        return reply.code(404).send({
          error: "NotFound",
          message: "Project meeting not found",
        });
      }

      // TODO: check if there are any active meetings using this project meeting page
      // TODO: consider soft delete instead of hard delete

      // Delete related records first (participant groups and employees)
      await fastify.prisma.meetingMeetingParticipantGroupEmployee.deleteMany({
        where: {
          meetingMeetingParticipantGroup: {
            meeting_request_page_id: parseInt(id),
          },
        },
      });

      await fastify.prisma.meetingParticipantGroup.deleteMany({
        where: { meeting_request_page_id: parseInt(id) },
      });

      // Delete the project meeting page
      await fastify.prisma.meetingRequestPage.delete({
        where: { id: parseInt(id) },
      });

      return reply.send({
        message: "Project meeting deleted successfully",
      });
    },
  );
}
