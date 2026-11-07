import { PrismaClient } from "@prisma/client";
import {
  availabilities,
  clients,
  meetingParticipantGroups,
  meetingRequests,
  PermissionsUpsert,
  projectRequestPages,
  projectsMeetingParticipantGroupEmployees,
  serviceRequests,
  services,
  users,
  userTypes,
} from "./data";

// add permissions and user types and notification settings and user type categories
async function main(prisma: PrismaClient) {
  console.log("📋 Starting Main Seeder...");
  console.log("=".repeat(50));

  try {
    console.log("🧹 Clearing existing data...");
    // delete logic for tables - order matters due to foreign key constraints
    await prisma.meeting.deleteMany();
    await prisma.meetingMeetingParticipantGroupEmployee.deleteMany();
    await prisma.meetingParticipantGroup.deleteMany();
    await prisma.meetingRequestPage.deleteMany();
    await prisma.service.deleteMany();
    await prisma.employeesAvailabilityHours.deleteMany();
    await prisma.employeesAvailability.deleteMany();
    await prisma.serviceRequest.deleteMany();
    await prisma.serviceRequestPage.deleteMany();
    await prisma.clientProfile.deleteMany();
    await prisma.user.deleteMany();
    await prisma.permission.deleteMany();
    console.log("✅ Existing data cleared");

    console.log("\n👥 Creating permission categories and permissions...");
    for (const permission of PermissionsUpsert) {
      await prisma.permission.upsert(permission);
    }
    console.log("✅ Permissions created");

    console.log("👥 Creating user types...");
    for (const userType of userTypes) {
      await prisma.userType.create({
        data: {
          name: userType.name,
          permissions: {
            connect: userType.permissions.map((permission) => ({
              id: permission,
            })),
          },
        },
      });
    }
    console.log("✅ User types created");

    console.log("👥 Creating users...");
    const usersData = await users();
    for (const user of usersData) {
      await prisma.user.create({
        data: {
          ...user,
          user_types: {
            connect: user.user_types.map((type) => ({
              id: type,
            })),
          },
        },
      });
    }
    console.log(`✅ ${usersData.length} users created`);

    console.log("🏗️ Creating services...");
    for (const service of services) {
      await prisma.service.create({
        data: service,
      });
    }
    console.log(`✅ ${services.length} services created`);

    console.log("📃 Creating service request pages...");
    await prisma.serviceRequestPage.createMany({
      data: [
        {
          domain: "contact.datatime4it.com",
        },
        {
          domain: "contact.rs4it.com",
        },
      ],
    });
    console.log("✅ Service request pages created");

    console.log("👥 Creating client profiles...");
    for (const client of clients) {
      await prisma.clientProfile.create({
        data: client,
      });
    }
    console.log(`✅ ${clients.length} client profiles created`);

    console.log("🏗️ Creating project request pages...");
    for (const projectPage of projectRequestPages) {
      await prisma.meetingRequestPage.create({
        data: projectPage,
      });
    }
    console.log(`✅ ${projectRequestPages.length} project request pages created`);

    console.log("👥 Creating meeting participant groups...");
    for (const group of meetingParticipantGroups) {
      await prisma.meetingParticipantGroup.create({
        data: group,
      });
    }
    console.log(`✅ ${meetingParticipantGroups.length} meeting participant groups created`);

    console.log("👥 Creating project meeting participant group employees...");
    for (const participant of projectsMeetingParticipantGroupEmployees) {
      await prisma.meetingMeetingParticipantGroupEmployee.create({
        data: participant,
      });
    }
    console.log(
      `✅ ${projectsMeetingParticipantGroupEmployees.length} project meeting participant group employees created`,
    );

    console.log("📅 Creating employee availabilities...");
    for (const availability of availabilities) {
      const { hours, ...availabilityData } = availability;
      const createdAvailability = await prisma.employeesAvailability.create({
        data: availabilityData,
      });

      // Create availability hours for each day
      for (const hour of hours) {
        await prisma.employeesAvailabilityHours.create({
          data: {
            employee_availability_id: createdAvailability.id,
            day_part: hour,
          },
        });
      }
    }
    console.log(`✅ ${availabilities.length} employee availabilities created with hours`);

    console.log("🤝 Creating meeting requests...");
    for (const meetingRequest of meetingRequests) {
      await prisma.meeting.create({
        data: meetingRequest,
      });
    }
    console.log(`✅ ${meetingRequests.length} meeting requests created`);

    console.log("📋 Creating service requests...");
    for (const serviceRequest of serviceRequests) {
      await prisma.serviceRequest.create({
        data: serviceRequest,
      });
    }
    console.log(`✅ ${serviceRequests.length} service requests created`);

    console.log("🎉 All data seeded successfully!");
  } catch (error) {
    console.error("❌ Error during main seeder:", error);
    throw error;
  }
}

export { main as seedMain };
