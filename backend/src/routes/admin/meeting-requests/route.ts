import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import getDataHandler from "src/lib/fetch-paginated-data";
import { z } from "zod";

// Schema for accepting a meeting
const acceptMeetingSchema = z.object({
  participant_employees: z.array(
    z.object({
      id: z.number().int().positive("Employee ID must be a positive integer"),
      required: z.boolean().optional(),
    }),
  ),
  guest_attendees: z.array(z.string()),
  description: z.string().optional(),
  start_at: z.string().datetime("Invalid date format"),
  duration: z.number().int().positive("Duration must be a positive integer in minutes"),
});

export default async function (fastify: FastifyInstance) {
  getDataHandler({
    path: "/",
    fastify,
    permission: ["meeting-requests:read-all"],
    tableName: "meeting",
    tags: ["meeting-requests"],
    handleFindArgs({ findArgs }) {
      return {
        findArgs: {
          ...findArgs,
          include: {
            clientProfile: true,
          },
        },
      };
    },
    async refactorResult({ data }) {
      const allEmployeeIds = data
        .map((meeting) =>
          (meeting.participant_employees as { id: number }[])?.map((employee) => employee.id),
        )
        .flat()
        .filter((id) => !!id);

      const allEmployees = await fastify.prisma.user.findMany({
        where: {
          id: {
            in: allEmployeeIds,
          },
        },
      });
      return {
        data: data.map((meeting) => {
          const meetingEmployees = meeting.participant_employees as { id: number }[];
          const meetingEmployeesWithNames = meetingEmployees.map((employee) => {
            const employeeWithName = allEmployees.find((e) => e.id === employee.id);
            return {
              ...employee,
              name:
                (employeeWithName?.first_name ?? "") + " " + (employeeWithName?.last_name ?? ""),
            };
          });
          return { ...meeting, participant_employees: meetingEmployeesWithNames };
        }),
      };
    },
  });

  getDataHandler({
    path: "/own",
    fastify,
    permission: ["meeting-requests:read-own"],
    tableName: "meeting",
    tags: ["meeting-requests"],
    handleFindArgs({ findArgs, request }) {
      const user_id = request.user.id;
      console.log("USER_ID", user_id);
      return {
        findArgs: {
          ...findArgs,
          where: {
            ...(findArgs?.where ?? {}),
            participant_employees: {
              // استخدام array_contains للبحث عن عنصر يحتوي على id معين
              array_contains: [{ id: user_id }],
            },
          },
          include: {
            clientProfile: true,
          },
        },
      };
    },
    async refactorResult({ data }) {
      const allEmployeeIds = data
        .map((meeting) =>
          (meeting.participant_employees as { id: number }[])?.map((employee) => employee.id),
        )
        .flat()
        .filter((id) => !!id);

      const allEmployees = await fastify.prisma.user.findMany({
        where: {
          id: {
            in: allEmployeeIds,
          },
        },
      });
      return {
        data: data.map((meeting) => {
          const meetingEmployees = meeting.participant_employees as { id: number }[];
          const meetingEmployeesWithNames = meetingEmployees.map((employee) => {
            const employeeWithName = allEmployees.find((e) => e.id === employee.id);
            return {
              ...employee,
              name:
                (employeeWithName?.first_name ?? "") + " " + (employeeWithName?.last_name ?? ""),
            };
          });
          return { ...meeting, participant_employees: meetingEmployeesWithNames };
        }),
      };
    },
  });

  // Accept meeting route
  fastify.withTypeProvider<ZodTypeProvider>().put(
    "/:id/accept",
    {
      schema: {
        params: z.object({
          id: z
            .string()
            .transform((val) => parseInt(val, 10))
            .pipe(z.number().int().positive()),
        }),
        body: acceptMeetingSchema,
        permissions: ["meeting-requests:accept"],
        tags: ["meeting-requests"],
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { participant_employees, guest_attendees, description, start_at, duration } =
        request.body;

      // Check if employees exist
      await fastify.prisma.user.findMany({
        where: {
          id: {
            in: participant_employees.map((employee) => employee.id),
          },
        },
      });

      // Calculate end_at based on start_at and duration
      const startDate = new Date(start_at);
      const endDate = new Date(startDate.getTime() + duration * 60 * 1000); // duration in minutes

      // Update the meeting
      const updatedMeeting = await fastify.prisma.meeting.update({
        where: { id },
        data: {
          participant_employees: participant_employees,
          guest_attendees: guest_attendees,
          description: description,
          start_at: startDate,
          end_at: endDate,
          duration: duration,
          status: "SCHEDULED",
        },
        include: {
          clientProfile: true,
        },
      });

      return reply.send({
        success: true,
        message: "Meeting accepted successfully",
        data: updatedMeeting,
      });
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().put(
    "/:id/reject",
    {
      schema: {
        params: z.object({
          id: z.coerce.number().int().positive(),
        }),
        permissions: ["meeting-requests:reject"],
        tags: ["meeting-requests"],
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      await fastify.prisma.meeting.update({
        where: { id },
        data: {
          status: "REJECTED",
        },
      });
      return reply.send({
        success: true,
        message: "Meeting rejected successfully",
      });
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().put(
    "/:id/complete",
    {
      schema: {
        params: z.object({
          id: z.coerce.number().int().positive(),
        }),
        permissions: ["meeting-requests:complete"],
        tags: ["meeting-requests"],
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      await fastify.prisma.meeting.update({
        where: { id },
        data: { status: "COMPLETED" },
      });
      return reply.send({
        success: true,
        message: "Meeting completed successfully",
      });
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().put(
    "/:id/immediately-accept",
    {
      schema: {
        params: z.object({
          id: z.coerce.number().int().positive(),
        }),
        permissions: ["meeting-requests:accept"],
        tags: ["meeting-requests"],
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      await fastify.prisma.meeting.update({
        where: { id },
        data: { status: "SCHEDULED" },
      });
      return reply.send({
        success: true,
        message: "Meeting completed successfully",
      });
    },
  );
}
