import bcrypt from "bcrypt";
import { FastifyInstance } from "fastify";
import { t } from "i18next";
import { HttpConstant } from "src/constants/HttpConstant";
import { CustomError } from "src/utils/custom-error";
import z from "zod";

// Login validation schema
// todo remove defaults
export const loginSchema = z.object({
  email: z.string().email(t("Invalid email format")).default("admin@meeting-demo.com"),
  password: z.string().min(6, t("Password must be at least 6 characters")).default("12345678"),
  device_token: z.string().optional(),
});

// Validation function
export async function validateUser(email: string, password: string, fastify: FastifyInstance) {
  // Find user by email
  const user = await fastify.prisma.user.findUnique({
    where: { email },
    include: {
      user_types: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!user) {
    throw new CustomError({
      message: "Invalid email or password",
      statusCode: HttpConstant.BAD_REQUEST,
    });
  }

  // Compare password
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw new CustomError({
      message: "Invalid email or password",
      statusCode: HttpConstant.BAD_REQUEST,
    });
  }

  return user;
}
