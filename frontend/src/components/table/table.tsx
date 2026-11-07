"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useTransition } from "react";

import { useLocale, useTranslations } from "next-intl";
import { useQueryState } from "nuqs";

import { TableToolbars } from "./components/table-toolbars";
import { DataTable } from "./data-table/data-table";
import { DataTableColumnHeader } from "./data-table/data-table-column-header";
import { useDataTable } from "./hooks/use-data-table";
import { searchParamsCache } from "./lib/validations";
import {
  DataTableAdvancedFilterField,
  ExtendedSortingState,
  Filter,
  JoinOperator,
  TableProps,
} from "./types/table";

// تعريف الأنواع محلياً
export interface TableSearchParams<TData> {
  filters: Filter<TData>[];
  joinOperator: JoinOperator;
  search: string;
  sort: ExtendedSortingState<TData>;
  page: number;
}

export function Table<TData extends { id: string | number }>(
  props: TableProps<TData>
) {
  const {
    data,
    filterFields,
    getColumns,
    pageCount = 10,
    isLoading,
    isError,
    refetch,
    withoutToolbar,
    advancedFilterFields: AdditionalAdvancedFilterFields,
    shallow,
    ...restProps
  } = props;

  const locale = useLocale();

  const [filters, setFilters] = useQueryState("filters");
  const [joinOperator, setJoinOperator] = useQueryState("joinOperator");
  const [search, setSearch] = useQueryState("search");
  const [sort, setSort] = useQueryState("sort");
  const [page, setPage] = useQueryState("page");

  const [revalidatingTable, startTableTransition] = useTransition();

  const router = useRouter();
  const t = useTranslations();
  const decoratedRefetch = React.useCallback(() => {
    if (refetch) {
      const searchParams: TableSearchParams<TData> = searchParamsCache.parse({
        filters,
        joinOperator,
        search,
        sort,
        page,
      } as any);
      refetch(searchParams);
    } else {
      router.refresh();
    }
  }, [refetch, router, filters, joinOperator, search, sort, page]);

  useEffect(() => {
    if (isLoading) return;
    startTableTransition(() => {
      decoratedRefetch();
    });
  }, [decoratedRefetch, startTableTransition, isLoading]);

  const columns = useMemo(
    () =>
      (typeof getColumns === "function" ? getColumns() : getColumns).map(
        (item) => {
          // @ts-ignore
          if (!item.accessorKey && item.id) item.accessorKey = item.id;
          return {
            ...item,
            header:
              item.header ||
              (({ column }) => (
                <DataTableColumnHeader
                  column={column}
                  title={t(item.headerName || column.id)}
                />
              )),
            // @ts-ignore
            id: item.accessorKey,
            // @ts-ignore
            accessorFn: item.accessorFn || ((value) => value[item.accessorKey]),
          };
        }
      ),
    [getColumns, t]
  );

  const { table } = useDataTable<TData>({
    data,
    columns,
    pageCount: pageCount,
    filterFields,
    enableAdvancedFilter: true,
    initialState: {
      columnPinning: { left: ["actions"], right: [] },
      tableId: "table",
    },
    getRowId: (originalRow) => originalRow.id.toString(),
    shallow: shallow ?? false,
    clearOnDefault: true,
    startTransition: startTableTransition,
    columnResizeDirection: locale === "ar" ? "rtl" : "ltr",
    tableId: "table",
  });

  const advancedFilterFields: DataTableAdvancedFilterField<TData>[] = columns
    .filter(
      (column) => column.id !== "actions" && column.enableColumnFilter !== false
    )
    .map((column) => ({
      id: column.filterKey ?? column.id,
      label: t(column.headerName ?? column.id),
      type: column.type ?? "text",
      ...(column.relationOperator != null
        ? { relationOperator: column.relationOperator }
        : {}),
      ...(column.type === "select" || column.type === "multi-select"
        ? { options: column.options }
        : {}),
    }));

  return (
    <DataTable
      table={table}
      isLoading={revalidatingTable || isLoading}
      isError={isError}
      advancedFilterFields={advancedFilterFields.concat(
        AdditionalAdvancedFilterFields || []
      )}
    >
      {!withoutToolbar && (
        <TableToolbars
          table={table}
          filterFields={filterFields}
          locale={locale}
          refetch={() => {
            startTableTransition(() => {
              decoratedRefetch();
            });
          }}
          {...restProps}
        />
      )}
    </DataTable>
  );
}
