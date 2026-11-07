import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { HttpConstant } from "src/constants/HttpConstant";

export const handlePrismaError = (
  err: PrismaClientKnownRequestError,
): { message: string; statusCode: number; code?: string } => {
  switch (err.code) {
    case "P2000":
      return {
        code: "P2000",
        message: `The provided value for the column is too long for the column's type. Column: ${err.meta?.column_name}`,
        statusCode: HttpConstant.BAD_REQUEST,
      };
    case "P2001":
      return {
        code: "P2001",
        message: `The record searched for in the where condition (${err.meta?.model_name}.${err.meta?.argument_name} = ${err.meta?.argument_value}) does not exist`,
        statusCode: HttpConstant.BAD_REQUEST,
      };
    case "P2002":
      return {
        code: "P2002",
        message: `the data you sent for field ${err.meta?.target} already exists and cannot be duplicated`,
        statusCode: HttpConstant.BAD_REQUEST,
      };
    case "P2003":
      return {
        code: "P2003",
        message: `Foreign key constraint failed on the field: ${err.meta?.field_name}`,
        statusCode: HttpConstant.BAD_REQUEST,
      };
    default:
      return {
        message: `${err.code} ${
          err.meta
            ? "error on ( " +
              Object.entries(err.meta)
                .map(([key, value]) => `${key}: ${value}`)
                .join(", ") +
              " )"
            : ""
        }`,
        statusCode: HttpConstant.INTERNAL_SERVER_ERROR,
      };
  }
};
