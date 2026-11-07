import { HttpConstant } from "src/constants/HttpConstant";

export class CustomError extends Error {
  statusCode: number;
  code?: string;

  constructor({
    message,
    statusCode = HttpConstant.BAD_REQUEST,
    code,
  }: {
    message: string;
    statusCode?: number;
    code?: string;
  }) {
    super(message);
    this.name = "CustomError";
    this.statusCode = statusCode;
    this.code = code;
  }
}
