import { z } from "zod";

export const commonHeadersSchema = z.object({
  "accept-language": z.enum(["en", "ar"]).default("en"),
});

export const commonHeadersJsonSchema = {
  type: "object",
  properties: {
    "accept-language": {
      type: "string",
      enum: ["en", "ar"],
      default: "en",
    },
  },
};
