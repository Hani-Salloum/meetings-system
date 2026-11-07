import { z } from "zod";

export const sortSchema = z.object({
  id: z.string(),
  desc: z.coerce.boolean(),
});

export const paginationSchema = z.object({
  page: z.coerce.string().regex(/^\d+$/).default("1"),
  pagesize: z.coerce.string().regex(/^\d+$/).default("10"),
  filters: z
    .any()
    .optional()
    .default([])
    .describe(`[{'id':'fields_name','operator':'eq','value':1,'type':'number'}]`),
  sort: z.any().optional().default([]).describe(`[{'id':'fields_name','desc':'true'}]`),
  search: z.string().optional(),
  joinOperator: z.enum(["and", "or"]).optional().default("and"),
});

export type QueryParams = z.infer<typeof paginationSchema>;
