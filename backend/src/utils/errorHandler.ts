import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
} from "fastify-type-provider-zod";
import { handlePrismaError } from "src/lib/prisma-error-handler";
import i18next from "../config/i18n";
import { HttpConstant } from "../constants/HttpConstant";

export const globalErrorHandler = (
  err: FastifyError,
  req: FastifyRequest,
  reply: FastifyReply,
): void => {
  let { statusCode, message, code } = err;
  // for debugging
  console.log(err);

  if (hasZodFastifySchemaValidationErrors(err)) {
    reply.code(400).send({
      error: "Response Validation Error",
      message: "Request doesn't match the schema",
      statusCode: 400,
      details: {
        issues: err.validation,
        method: req.method,
        url: req.url,
      },
    });
    return;
  }

  if (isResponseSerializationError(err)) {
    reply.code(500).send({
      error: "Internal Server Error",
      message: "Response doesn't match the schema",
      statusCode: 500,
      details: {
        issues: err.cause.issues,
        method: err.method,
        url: err.url,
      },
    });
    return;
  }

  // handle prisma errors
  if (err instanceof PrismaClientKnownRequestError) {
    const refactoredError = handlePrismaError(err);
    statusCode = refactoredError.statusCode;
    message = refactoredError.message;
    code = refactoredError.code || "unknown_error";
    statusCode = HttpConstant.BAD_REQUEST;
  }

  statusCode = statusCode || HttpConstant.INTERNAL_SERVER_ERROR;
  message = message || i18next.t("error.internal_server_error");
  reply.status(statusCode).send({
    message,
    error: err.name || "unknown_error",
    method: req.method,
    url: req.url,
    code,
  });
};

export const notFoundHandler = (req: FastifyRequest, res: FastifyReply): void => {
  const message = i18next.t("error.not_found");
  res.status(HttpConstant.NOT_FOUND).send({
    message,
    error: null,
    method: req.method,
    url: req.url,
  });
};
