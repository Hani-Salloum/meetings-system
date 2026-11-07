import { QueryParams } from "../pagination-schemas";

export const buildPrismaOrderBy = (sort: QueryParams["sort"], allowedFields: string[]) =>
  (Array.isArray(sort) ? sort : []).reduce((acc, s) => {
    if (allowedFields.includes(s.id)) {
      acc.push({ [s.id]: s.desc ? "desc" : "asc" });
    }
    return acc;
  }, []) ?? undefined;
