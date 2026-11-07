import { z } from "zod";

export const filterSchema = z.object({
  id: z.string().regex(/^[a-zA-Z0-9_.]+$/), // Allow dots for nested fields (e.g., driver.status)
  value: z.union([z.string(), z.number(), z.array(z.string()), z.array(z.number())]),
  type: z.enum(["text", "number", "boolean", "date"]),
  operator: z.enum([
    "eq",
    "ne",
    "iLike",
    "notILike",
    "contains",
    "gt",
    "lt",
    "gte",
    "lte",
    "isBetween",
    "isEmpty",
    "isNotEmpty",
  ]),
  relationOperator: z.enum(["every", "some", "none"]).optional(),
});
