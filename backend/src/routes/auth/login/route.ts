import { format } from "date-fns";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import geoip from "geoip-lite";
import { t } from "i18next";
import env from "src/config/env";
import { HttpConstant } from "src/constants/HttpConstant";
import { CustomError } from "src/utils/custom-error";
import { z } from "zod";
import { loginSchema, validateUser } from "./validateUser";

const responseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    user: z.object({
      id: z.number(),
      email: z.string(),
      created_at: z.string(),
    }),
    token: z.string(),
  }),
});

export default async function (fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/",
    {
      schema: {
        summary: "Login",
        tags: ["auth"],
        operationId: "login",
        body: loginSchema,
        response: {
          200: responseSchema,
        },
      },
    },
    async (request, reply) => {
      const { email, password, device_token } = request.body;

      const user = await validateUser(email, password, fastify); // Your auth logic

      if (!user.confirmed_email) {
        throw new CustomError({
          message: "Email not confirmed, check your email for confirmation code",
          statusCode: HttpConstant.UNAUTHORIZED,
        });
      }

      // 1. Generate access token
      const accessToken = await reply.jwtSign(
        {
          id: user.id,
        },
        { expiresIn: env.JWT_ACCESS_TOKEN_EXPIRES_IN },
      );

      // Gather login time and device information
      const loginTime = format(new Date(), "yyyy-MM-dd h:mm:ss a"); // 12-hour format with AM/PM
      let deviceInfo = request.headers["user-agent"] || "Unknown Device";
      deviceInfo += `|${request.headers["sec-ch-ua-mobile"]}|${request.headers["sec-ch-ua-platform"]}`;
      const ip = request.ip;
      const geo = geoip.lookup(ip);

      const location = geo ? `${geo.city}, ${geo.region}, ${geo.country}` : "Unknown Location";

      // 2. Store refresh token in database
      if (device_token) {
        await fastify.prisma.user.update({
          where: { id: user.id },
          data: {
            devices: {
              upsert: {
                where: {
                  fcmTokens: device_token,
                },
                create: {
                  auth_token: accessToken,
                  fcmTokens: device_token,
                  login_location: location,
                  device_info: deviceInfo,
                },
                update: {
                  auth_token: accessToken,
                  login_location: location,
                  device_info: deviceInfo,
                },
              },
            },
          },
        });
      } else {
        await fastify.prisma.user.update({
          where: { id: user.id },
          data: {
            devices: {
              create: {
                auth_token: accessToken,
                fcmTokens: device_token,
                login_location: location,
                device_info: deviceInfo,
              },
            },
          },
        });
      }

      // Send login notification email
      const templateVars = {
        title: "Login Notification",
        loginTime,
        location,
        name: "sprintly",
      };

      const htmlContent = await fastify.view("../views/login_notification.ejs", templateVars);

      fastify.sendEmails([email], "Login Notification", htmlContent);

      // Return response in the required format
      return {
        success: true,
        message: t("login.success"),
        data: {
          user: {
            id: user.id,
            email: user.email,
            created_at: user.created_at.toISOString(),
          },
          token: accessToken,
        },
      };
    },
  );
}
