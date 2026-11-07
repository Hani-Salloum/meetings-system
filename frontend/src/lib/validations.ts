import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";
import * as z from "zod";

import {
  getFiltersStateParser,
  getSortingStateParser,
} from "@/components/table/lib/parsers";

export const searchParamsCache = createSearchParamsCache({
  flags: parseAsArrayOf(z.enum(["advancedTable", "floatingBar"])).withDefault(
    []
  ),
  page: parseAsInteger.withDefault(1),
  pagesize: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<any>().withDefault([
    { id: "created_at", desc: true },
  ]),
  title: parseAsString.withDefault(""),
  search: parseAsString.withDefault(""),
  // status: parseAsArrayOf(z.enum(tasks.status.enumValues)).withDefault([]),
  // priority: parseAsArrayOf(z.enum(tasks.priority.enumValues)).withDefault([]),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
  // advanced filter
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});

export type GetSchema = Awaited<ReturnType<typeof searchParamsCache.parse>>;

export type OptionalGetSchema = Partial<GetSchema>;
