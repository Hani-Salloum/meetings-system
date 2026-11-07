import {
  MeetingMeetingParticipantGroupEmployee,
  MeetingParticipantGroup,
  MeetingRequestPage,
} from "@prisma/client";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

// Request schema for order service
const orderServiceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  country_code: z.string().min(1, "Country code is required"),
  phone: z.string().min(1, "Phone is required"),
  description: z.string().min(1, "Description is required"),
  domain: z.string().min(1, "Domain is required"),
});

// Request schema for meeting request
const meetingRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  country_code: z.string().min(1, "Country code is required"),
  phone: z.string().min(1, "Phone is required"),
  description: z.string().min(1, "Description is required"),
  pathname: z.string().min(1, "Project pathname is required"),
  preferred_date: z
    .string()
    .datetime("Invalid date format")
    .transform((str) => new Date(str).toISOString()),
  guest_attendees: z.array(z.string()).optional(),
});

async function getGroupsSchedule({
  projectMeeting,
  fastify,
}: {
  projectMeeting: MeetingRequestPage & {
    meetingParticipantGroups: (MeetingParticipantGroup & {
      meetingMeetingParticipantGroupEmployees: MeetingMeetingParticipantGroupEmployee[];
    })[];
  };
  fastify: FastifyInstance;
}) {
  // Process each group separately to get common availability within each group
  const groupCommonAvailabilities: Array<{
    groupId: string;
    commonAvailableSlots: { day: string; hours: string[] }[];
  }> = [];

  for (const group of projectMeeting.meetingParticipantGroups) {
    const groupEmployeeIds = group.meetingMeetingParticipantGroupEmployees.map(
      (employee) => employee.employee_id,
    );

    if (groupEmployeeIds.length === 0) continue;

    // Get availabilities for employees in this specific group
    const groupEmployeeAvailabilities = await fastify.prisma.employeesAvailability.findMany({
      where: {
        user_id: {
          in: groupEmployeeIds,
        },
      },
      include: {
        employeesAvailabilityHours: true,
      },
    });

    // Build availability map for this group
    const groupEmployeeAvailabilitiesMap = new Map<string, { day: string; hours: string[] }[]>();
    groupEmployeeAvailabilities.forEach((availability) => {
      const employeeId = availability.user_id.toString();
      if (!groupEmployeeAvailabilitiesMap.has(employeeId)) {
        groupEmployeeAvailabilitiesMap.set(employeeId, []);
      }
      groupEmployeeAvailabilitiesMap.get(employeeId)?.push({
        day: availability.week_day,
        hours: availability.employeesAvailabilityHours.map((h) => h.day_part),
      });
    });

    // Calculate common available slots for this group
    const groupCommonSlots: { day: string; hours: string[] }[] = [];

    if (groupEmployeeAvailabilitiesMap.size > 0) {
      // Get all unique days from employees in this group
      const groupDays = new Set<string>();
      groupEmployeeAvailabilitiesMap.forEach((employeeSlots) => {
        employeeSlots.forEach((slot) => {
          groupDays.add(slot.day);
        });
      });

      // For each day, find common hours across employees in this group
      groupDays.forEach((day) => {
        const daySlots = Array.from(groupEmployeeAvailabilitiesMap.values()).map(
          (employeeSlots) => {
            const daySlot = employeeSlots.find((slot) => slot.day === day);
            return daySlot ? daySlot.hours : [];
          },
        );

        // Find intersection of hours for this day within the group
        if (daySlots.length > 0) {
          const commonHours = daySlots.reduce((common, current) => {
            return common.filter((hour) => current.includes(hour));
          });

          if (commonHours.length > 0) {
            groupCommonSlots.push({
              day,
              hours: commonHours,
            });
          }
        }
      });
    }

    groupCommonAvailabilities.push({
      groupId: group.id.toString(),
      commonAvailableSlots: groupCommonSlots,
    });
  }
  return groupCommonAvailabilities;
}

export default async function routes(fastify: FastifyInstance) {
  fastify.post(
    "/order-service",
    {
      schema: {
        body: orderServiceSchema,
        tags: ["external"],
      },
    },
    async (request, reply) => {
      const { name, email, country_code, phone, description, domain } = request.body as z.infer<
        typeof orderServiceSchema
      >;
      const clientIP =
        (request.headers["x-forwarded-for"] as string)?.split(",")[0] || request.ip || "unknown";

      // Get Prisma client
      const prisma = fastify.prisma;

      // Check if client exists
      let client = await prisma.clientProfile.findUnique({
        where: {
          ip: clientIP.toString(),
        },
      });

      // If client doesn't exist, create new one
      if (!client) {
        client = await prisma.clientProfile.create({
          data: {
            name,
            email,
            country_code,
            phone,
            ip: clientIP.toString(),
            status: "ACTIVE",
          },
        });
      } else {
        // Check if existing client is blocked
        if (client.status === "BLOCKED") {
          return reply.status(403).send({
            success: false,
            message: "Client is blocked",
          });
        }
      }

      // Check if service request page exists
      const serviceRequestPage = await prisma.serviceRequestPage.findUnique({
        where: { domain },
      });

      if (!serviceRequestPage) {
        return reply.status(404).send({
          success: false,
          message: "Service request page not found",
        });
      }

      // Create service request
      const serviceRequest = await prisma.serviceRequest.create({
        data: {
          client_profile_id: client.id,
          name,
          email,
          country_code,
          phone,
          description,
          service_request_page_name: domain,
        },
      });

      return reply.status(201).send({
        success: true,
        data: {
          serviceRequestId: serviceRequest.id,
          clientId: client.id,
          message: "Service request created successfully",
        },
      });
    },
  );

  // Get single project meeting by pathname
  fastify.get(
    "/:pathname",
    {
      schema: {
        params: z.object({
          pathname: z.string(),
        }),
        permissions: [],
        tags: ["external"],
      },
    },
    async (request, reply) => {
      const { pathname } = request.params as { pathname: string };

      const projectMeeting = await fastify.prisma.meetingRequestPage.findUnique({
        where: { pathname },
        include: {
          meetingParticipantGroups: {
            include: {
              meetingMeetingParticipantGroupEmployees: true,
            },
          },
        },
      });

      if (!projectMeeting) {
        return reply.code(404).send({
          error: "NotFound",
          message: "Project meeting not found",
        });
      }

      if (projectMeeting.status === "INACTIVE") {
        return reply.code(403).send({
          error: "Forbidden",
          message: "Project meeting is inactive",
        });
      }

      const groupCommonAvailabilities = await getGroupsSchedule({ projectMeeting, fastify });

      return reply.send({
        ...projectMeeting,
        groupCommonAvailabilities,
      });
    },
  );

  // post to create a new meeting in requested status.. save the client whose request the meeting
  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/meeting-request",
    {
      schema: {
        body: meetingRequestSchema,
        tags: ["external"],
      },
    },
    async (request, reply) => {
      const {
        name,
        email,
        country_code,
        phone,
        description,
        pathname,
        preferred_date,
        guest_attendees,
      } = request.body;

      const clientIP =
        (request.headers["x-forwarded-for"] as string)?.split(",")[0] || request.ip || "unknown";

      // Get Prisma client
      const prisma = fastify.prisma;

      // Check if project request page exists and is active
      const projectRequestPage = await prisma.meetingRequestPage.findUnique({
        where: { pathname },
        include: {
          meetingParticipantGroups: {
            include: {
              meetingMeetingParticipantGroupEmployees: true,
            },
          },
        },
      });

      if (!projectRequestPage) {
        return reply.status(404).send({
          success: false,
          message: "Project meeting page not found",
        });
      }

      if (projectRequestPage.status === "INACTIVE") {
        return reply.status(403).send({
          success: false,
          message: "Project meeting page is inactive",
        });
      }

      // Use project's duration for the meeting
      const duration = projectRequestPage.duration;

      // Check if client exists
      let client = await prisma.clientProfile.findUnique({
        where: { ip: clientIP.toString() },
      });

      // If client doesn't exist, create new one
      if (!client) {
        client = await prisma.clientProfile.create({
          data: {
            name,
            email,
            country_code,
            phone,
            ip: clientIP.toString(),
            status: "ACTIVE",
          },
        });
      } else {
        // Check if existing client is blocked
        if (client.status === "BLOCKED") {
          return reply.status(403).send({
            success: false,
            message: "Client is blocked",
          });
        }
      }

      // Parse preferred date and validate it's in the future
      const startAt = new Date(preferred_date);
      const now = new Date();

      if (startAt <= now) {
        return reply.status(400).send({
          success: false,
          message: "Preferred date must be in the future",
        });
      }

      const endAt = new Date(startAt.getTime() + duration * 60000); // Convert minutes to milliseconds

      const groupCommonAvailabilities = await getGroupsSchedule({
        projectMeeting: projectRequestPage,
        fastify,
      });

      // const ordered_hour = `HOUR_${startAt.getHours()}`;
      const ordered_hour = `HOUR_${parseInt(preferred_date.split("T")[1].split(":")[0]) + 3}`;
      const daysOfWeek = [
        "SUNDAY",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
      ] as const;

      const dayNumber = startAt.getDay(); // القيمة التي ستأخذها getDay() هي من 0 إلى 6
      const dayName = daysOfWeek[dayNumber]; // هنا نقوم بربط الرقم باسم اليوم

      const commonAvailableSlots = Object.entries(groupCommonAvailabilities).find(
        ([, { commonAvailableSlots }]) => {
          return commonAvailableSlots.find(
            (slot) => slot.day === dayName && slot.hours.includes(ordered_hour),
          );
        },
      );

      if (!commonAvailableSlots) {
        return reply.status(400).send({
          success: false,
          message: "No common available slots found for this day",
          preferred_date: preferred_date.replace("Z", "+03:00"),
          startAt: startAt.toISOString(),
          now: now.toISOString(),
          dayName,
          ordered_hour,
        });
      }

      const groupId = commonAvailableSlots[1].groupId;
      const group = await fastify.prisma.meetingParticipantGroup.findUnique({
        where: {
          id: parseInt(groupId),
        },
        include: {
          meetingMeetingParticipantGroupEmployees: true,
        },
      });

      // Create meeting in REQUESTED status
      const meeting = await prisma.meeting.create({
        data: {
          client_profile_id: client.id,
          meeting_request_page_pathname: pathname,
          status: "REQUESTED",
          description,
          start_at: startAt,
          end_at: endAt,
          duration: duration,
          guest_attendees: guest_attendees || undefined,
          scheduled_by_user_id: null, // Will be set when an employee schedules the meeting
          participant_employees:
            group?.meetingMeetingParticipantGroupEmployees.map((emp) => ({
              id: emp.employee_id,
              required: emp.required,
            })) || [],
        },
      });

      return reply.status(201).send({
        success: true,
        data: {
          meetingId: meeting.id,
          clientId: client.id,
          status: meeting.status,
          message: "Meeting request created successfully",
          dayName,
          ordered_hour,
        },
      });
    },
  );
}
