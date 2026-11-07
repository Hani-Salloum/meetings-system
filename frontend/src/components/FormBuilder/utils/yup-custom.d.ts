// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { StringSchema } from "yup";

declare module "yup" {
  interface StringSchema {
    englishOnly(message?: string, overRide?: boolean): this;
    arabicOnly(message?: string, overRide?: boolean): this;
    numbersOnly(message?: string): this;
    passwordMinLength(message?: string): this;
    lettersOnly(message?: string): this;
    url(message?: string): this;
  }
}
