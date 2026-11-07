import { Metadata } from "next";
import { Suspense } from "react";

import { SearchParams } from "nuqs";

import { DataTableSkeleton } from "@/components/table/data-table/data-table-skeleton";
import { LocaleParams } from "@/i18n/params";
import { GetSchema, searchParamsCache } from "@/lib/validations";

import ExampleTableServer from "./components/example-table-server";

export const metadata: Metadata = {
  title: "Example Page",
  description: "Example Page Description",
};

const ExamplePage = async ({
  params,
  searchParams,
}: {
  params: LocaleParams;
  searchParams: Promise<SearchParams>;
}) => {
  const { locale } = await params;
  const searchParamsResolved = await searchParams;
  const filtersString =
    typeof searchParamsResolved.filters === "string"
      ? searchParamsResolved.filters
      : "[]";

  const parsedFilters = JSON.parse(filtersString);

  const search: GetSchema = {
    ...searchParamsCache.parse(searchParamsResolved),
    filters: parsedFilters,
  };
  return (
    <Suspense
      fallback={
        <DataTableSkeleton
          columnCount={4}
          searchableColumnCount={1}
          filterableColumnCount={2}
          shrinkZero
        />
      }
    >
      <ExampleTableServer locale={locale} search={search} />
    </Suspense>
  );
};

export default ExamplePage;
