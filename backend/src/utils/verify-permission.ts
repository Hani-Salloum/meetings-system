import { FastifyReply, FastifyRequest } from "fastify";
import { t } from "i18next";
import { HttpConstant } from "src/constants/HttpConstant";
import { permissions } from "src/constants/permissions";
import { CustomError } from "./custom-error";

type Permission = keyof typeof permissions;
type VerifyPermissionInput = {
  permission: Permission[];
  type?: "anyOf" | "allOf";
  reply: FastifyReply;
  request: FastifyRequest;
};

export function verifyPermission({
  permission,
  reply,
  type = "anyOf",
  request,
}: VerifyPermissionInput) {
  // add permission to header
  reply.header("x-permission", permission.map((p) => p).join(","));

  // check if user is active
  if (!request.user || !request.user.active) {
    throw new CustomError({
      message: t("account is not active, connect with support to solve the issue"),
      statusCode: HttpConstant.FORBIDDEN,
      code: "account_not_active",
    });
  }

  // check if user is confirmed
  if (!request.user.confirmed_email) {
    throw new CustomError({
      message: t("email is not confirmed, check your email for confirmation code"),
      statusCode: HttpConstant.FORBIDDEN,
      code: "email_not_confirmed",
    });
  }

  // check if user has permission
  if (
    type === "anyOf"
      ? !request.user?.permissions?.some((p) => permission.some((p2) => p2 === p))
      : !request.user?.permissions?.every((p) => permission.some((p2) => p2 === p))
  ) {
    throw new CustomError({
      message: t("error.access_forbidden"),
      statusCode: HttpConstant.FORBIDDEN,
      code: "access_forbidden",
    });
  }

  return true;
}
