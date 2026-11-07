import { GetSchema } from "@/lib/validations";

export function createQueryParams(search: GetSchema): { [key: string]: any } {
  return {
    search: search.search,
    page: search.page.toString(),
    pagesize: search.pagesize.toString(),
    filters: search.filters,
    sort: search.sort,
    joinOperator: search.joinOperator,
  };
}
