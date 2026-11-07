import crypto from "crypto";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { t } from "i18next";
import { HttpConstant } from "src/constants/HttpConstant";
import { z } from "zod";

export default async function (fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/prepare",
    {
      schema: {
        body: z.object({
          email: z.string().email(t("email not valid")),
        }),
        tags: ["reset password"],
      },
    },
    async (request, reply) => {
      const { email } = request.body;

      // Find the password reset token in the database
      const added = await fastify.prisma.user.update({
        where: { email },
        data: {
          reset_password_code: crypto.randomInt(100000, 999999).toString(),
        },
      });

      const templateVars = {
        title: "Reset Password Code | إعادة تعيين رمز المرور",
        resetCode: added.reset_password_code,
      };

      const htmlContent = await fastify.view("../views/reset_password_code.ejs", templateVars);

      await fastify.sendEmails([email], templateVars.title, htmlContent);

      if (added) {
        return reply.status(HttpConstant.OK).send({
          message: t("verification code sent to email"),
        });
      } else {
        return reply.status(HttpConstant.BAD_REQUEST).send({
          message: t("there is no user with this email"),
        });
      }
    },
  );
  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/reset",
    {
      schema: {
        body: z.object({
          reset_password_code: z.string().min(4, t("Token is required")),
          password: z.string().min(8, t("Password must be at least 8 characters")),
          email: z.string().email(t("email not valid")),
        }),
        tags: ["reset password"],
      },
    },
    async (request, reply) => {
      const { password, email, reset_password_code } = request.body;

      // Find the password reset token in the database
      await fastify.prisma.user.update({
        where: { email, reset_password_code },
        data: {
          password,
        },
      });

      return reply.status(200).send({
        message: t("Password reset successfully"),
      });
    },
  );
}
