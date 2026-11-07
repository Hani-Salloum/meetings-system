import bcrypt from "bcrypt";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import getDataHandler from "src/lib/fetch-paginated-data";
import { z } from "zod";

// Schema for creating a new user
export const createUserSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  language: z.enum(["AR", "EN"]).default("AR"),
  user_type_ids: z.array(z.number().int().positive()).optional(),
});

// Schema for updating a user
export const updateUserSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters").optional(),
  last_name: z.string().min(2, "Last name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email format").optional(),
  language: z.enum(["AR", "EN"]).optional(),
  user_type_ids: z.array(z.number().int().positive()).optional(),
});

// Schema for user ID parameter
export const userIdParamsSchema = z.object({
  id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive("User ID must be a positive integer")),
});

export default async function (fastify: FastifyInstance) {
  // Get all users with pagination, filtering, and sorting
  getDataHandler({
    fastify,
    tableName: "user",
    permission: ["user:read-all"],
    tags: ["users"],
    findArgs: {
      omit: {
        password: true,
        reset_password_code: true,
        email_confirmation_code: true,
      },
      include: {
        user_types: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
  });

  // Get single user by ID
  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/:id",
    {
      schema: {
        params: userIdParamsSchema,
        permissions: ["user:read"],
        tags: ["users"],
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const user = await fastify.prisma.user.findUnique({
        where: { id },
        omit: {
          password: true,
          reset_password_code: true,
          email_confirmation_code: true,
        },
        include: {
          user_types: {
            select: {
              id: true,
              name: true,
            },
          },
          devices: {
            select: {
              user_id: true,
              fcmTokens: true,
              device_info: true,
              created_at: true,
            },
          },
        },
      });

      if (!user) {
        return reply.status(404).send({
          success: false,
          message: "User not found",
          data: null,
        });
      }

      // Remove password from response
      const { ...userWithoutPassword } = user;

      return reply.send({
        success: true,
        message: "User retrieved successfully",
        data: userWithoutPassword,
      });
    },
  );

  // Create new user
  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/",
    {
      schema: {
        body: createUserSchema,
        permissions: ["user:create"],
        tags: ["users"],
      },
    },
    async (request, reply) => {
      const userData = request.body;

      // Check if user with email already exists
      const existingUser = await fastify.prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        return reply.status(400).send({
          success: false,
          message: "User with this email already exists",
          data: null,
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create user
      const newUser = await fastify.prisma.user.create({
        data: {
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          password: hashedPassword,
          language: userData.language,
          confirmed_email: true, // Admin created users are automatically confirmed
          active: true,
        },
        include: {
          user_types: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Assign user types if provided
      if (userData.user_type_ids && userData.user_type_ids.length > 0) {
        await fastify.prisma.user.update({
          where: { id: newUser.id },
          data: {
            user_types: {
              connect: userData.user_type_ids.map((typeId) => ({ id: typeId })),
            },
          },
        });
      }

      // Get updated user with user types
      const userWithTypes = await fastify.prisma.user.findUnique({
        where: { id: newUser.id },
        omit: {
          password: true,
          reset_password_code: true,
          email_confirmation_code: true,
        },
        include: {
          user_types: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Remove password from response
      const { ...userWithoutPassword } = userWithTypes!;

      return reply.status(201).send({
        success: true,
        message: "User created successfully",
        data: userWithoutPassword,
      });
    },
  );

  // Update user
  fastify.withTypeProvider<ZodTypeProvider>().put(
    "/:id",
    {
      schema: {
        params: userIdParamsSchema,
        body: updateUserSchema,
        permissions: ["user:update"],
        tags: ["users"],
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const updateData = request.body;

      // Check if user exists
      const existingUser = await fastify.prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        return reply.status(404).send({
          success: false,
          message: "User not found",
          data: null,
        });
      }

      // Check if email is being updated and if it already exists
      if (updateData.email && updateData.email !== existingUser.email) {
        const emailExists = await fastify.prisma.user.findUnique({
          where: { email: updateData.email },
        });

        if (emailExists) {
          return reply.status(400).send({
            success: false,
            message: "User with this email already exists",
            data: null,
          });
        }
      }

      // Prepare update data
      const dataToUpdate: Record<string, unknown> = {};
      if (updateData.first_name !== undefined) dataToUpdate.first_name = updateData.first_name;
      if (updateData.last_name !== undefined) dataToUpdate.last_name = updateData.last_name;
      if (updateData.email !== undefined) dataToUpdate.email = updateData.email;
      if (updateData.language !== undefined) dataToUpdate.language = updateData.language;

      // Update user
      const updatedUser = await fastify.prisma.user.update({
        where: { id },
        data: dataToUpdate,
        include: {
          user_types: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Update user types if provided
      if (updateData.user_type_ids !== undefined) {
        // First disconnect all existing user types
        await fastify.prisma.user.update({
          where: { id },
          data: {
            user_types: {
              set: [],
            },
          },
        });

        // Then connect new user types
        if (updateData.user_type_ids.length > 0) {
          await fastify.prisma.user.update({
            where: { id },
            data: {
              user_types: {
                connect: updateData.user_type_ids.map((typeId) => ({ id: typeId })),
              },
            },
          });
        }

        // Get updated user with user types
        const userWithUpdatedTypes = await fastify.prisma.user.findUnique({
          where: { id },
          omit: {
            password: true,
            reset_password_code: true,
            email_confirmation_code: true,
          },
          include: {
            user_types: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        // Remove password from response
        const { ...userWithoutPassword } = userWithUpdatedTypes!;

        return reply.send({
          success: true,
          message: "User updated successfully",
          data: userWithoutPassword,
        });
      }

      // Remove password from response
      const { ...userWithoutPassword } = updatedUser;

      return reply.send({
        success: true,
        message: "User updated successfully",
        data: userWithoutPassword,
      });
    },
  );

  // Delete user
  fastify.withTypeProvider<ZodTypeProvider>().delete(
    "/:id",
    {
      schema: {
        params: userIdParamsSchema,
        permissions: ["user:delete"],
        tags: ["users"],
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      // Check if user exists
      const existingUser = await fastify.prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        return reply.status(404).send({
          success: false,
          message: "User not found",
          data: null,
        });
      }

      // Delete user devices first
      await fastify.prisma.device.deleteMany({
        where: { user_id: id },
      });

      // Delete user
      await fastify.prisma.user.delete({
        where: { id },
      });

      return reply.send({
        success: true,
        message: "User deleted successfully",
        data: null,
      });
    },
  );

  // Toggle user active status
  fastify.withTypeProvider<ZodTypeProvider>().put(
    "/:id/toggle-active",
    {
      schema: {
        params: userIdParamsSchema,
        permissions: ["user:toggle-active"],
        tags: ["users"],
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      // Check if user exists
      const existingUser = await fastify.prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        return reply.status(404).send({
          success: false,
          message: "User not found",
          data: null,
        });
      }

      const isCurrentlyActive = existingUser.active;
      const newActiveStatus = !isCurrentlyActive;

      // Update user active status
      const updatedUser = await fastify.prisma.user.update({
        where: { id },
        omit: {
          password: true,
          reset_password_code: true,
          email_confirmation_code: true,
        },
        data: { active: newActiveStatus },
        include: {
          user_types: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      const action = newActiveStatus ? "activated" : "deactivated";
      const message = `User ${action} successfully`;

      // Remove password from response
      const { ...userWithoutPassword } = updatedUser;

      return reply.send({
        success: true,
        message,
        data: userWithoutPassword,
      });
    },
  );

  getDataHandler({
    path: "/user-types",
    permission: [],
    tags: ["users"],
    fastify,
    tableName: "userType",
  });
}
