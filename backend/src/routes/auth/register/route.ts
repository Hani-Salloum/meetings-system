import crypto from "crypto";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { HttpConstant } from "src/constants/HttpConstant";
import { CustomError } from "src/utils/custom-error";
import { z } from "zod";

export default async function (fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().post("/verify-email", {
    schema: {
      summary: "Verify email",
      description: "Verify email",
      tags: ["register"],
      body: z.object({
        email: z.string().email(),
        code: z.string(),
      }),
      response: {
        200: z.object({
          message: z.string(),
        }),
      },
      rateLimit: {
        max: 6,
        window: "1d",
      },
    },
    handler: async (request, reply) => {
      const { email, code } = request.body;
      try {
        await fastify.prisma.user.update({
          where: { email, email_confirmation_code: code },
          data: { confirmed_email: true },
        });
      } catch {
        throw new CustomError({
          message: "Invalid email or code",
          statusCode: HttpConstant.BAD_REQUEST,
        });
      }

      return reply.status(200).send({ message: "Email verified successfully" });
    },
  });

  fastify.withTypeProvider<ZodTypeProvider>().post("/resend-email-confirmation-code", {
    schema: {
      summary: "Resend email confirmation code",
      description: "Resend email confirmation code",
      tags: ["register"],
      body: z.object({
        email: z.string().email(),
      }),
      response: {
        200: z.object({ message: z.string() }),
      },
    },
    handler: async (request, reply) => {
      const { email } = request.body;
      const user = await fastify.prisma.user.update({
        where: { email },
        data: {
          email_confirmation_code: crypto.randomInt(100000, 999999).toString(),
        },
      });

      const templateVars = {
        title: "Resend Email Confirmation Code | إعادة إرسال رمز تأكيد البريد الإلكتروني",
        confirmationCode: user.email_confirmation_code,
      };

      const htmlContent = await fastify.view("../views/email_confirmation_code.ejs", templateVars);

      await fastify.sendEmails([email], templateVars.title, htmlContent);

      if (!user) {
        throw new CustomError({
          message: "User not found",
          statusCode: HttpConstant.BAD_REQUEST,
        });
      }

      return reply
        .status(200)
        .send({ message: "sent successfully, check your email for confirmation code" });
    },
  });
}
