"use client";

import * as React from "react";

import { Icon } from "@iconify/react/dist/iconify.js";
import type { Table } from "@tanstack/react-table";
import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { DeleteDialog } from "@/components/shared/delete-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { DataTableFilterField } from "../types/table";

import { DataTableFacetedFilter } from "./data-table-faceted-filter";

interface DataTableToolbarProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>;
  locale: Locale;
  onDelete?: (selectedRows: TData[]) => void;
  /**
   * An array of filter field configurations for the data table.
   * When options are provided, a faceted filter is rendered.
   * Otherwise, a search filter is rendered.
   *
   * @example
   * const filterFields = [
   *   {
   *     id: 'name',
   *     label: 'Name',
   *     placeholder: 'Filter by name...'
   *   },
   *   {
   *     id: 'status',
   *     label: 'Status',
   *     options: [
   *       { label: 'Active', value: 'active', icon: ActiveIcon, count: 10 },
   *       { label: 'Inactive', value: 'inactive', icon: InactiveIcon, count: 5 }
   *     ]
   *   }
   * ]
   */
  filterFields?: DataTableFilterField<TData>[];
}

export function DataTableToolbar<TData>({
  table,
  filterFields = [],
  children,
  className,
  locale,
  onDelete,
  ...props
}: DataTableToolbarProps<TData>) {
  const t = useTranslations("TableConfig");

  const [, startDeleteTransition] = React.useTransition();

  const isFiltered = table.getState().columnFilters.length > 0;

  const handleDelete = () => {
    const selectedRows = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original);
    if (onDelete) {
      startDeleteTransition(() => {
        onDelete(selectedRows);
      });
    }
  };

  // Memoize computation of searchableColumns and filterableColumns
  const { searchableColumns, filterableColumns } = React.useMemo(() => {
    return {
      searchableColumns: filterFields.filter((field) => !field.options),
      filterableColumns: filterFields.filter((field) => field.options),
    };
  }, [filterFields]);

  return (
    <div {...props}>
      <div className={cn("flex w-full items-center justify-end gap-2")}>
        {table.getFilteredSelectedRowModel().rows.length > 0 && onDelete && (
          <>
            <DeleteDialog
              data={table
                .getFilteredSelectedRowModel()
                .rows.map((row) => row.original)}
              onSuccess={() => table.toggleAllRowsSelected(false)}
              onDelete={handleDelete}
            />
          </>
        )}
        {/* <DataTableViewOptions table={table} /> */}
        {/* <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            exportTableToCSV(table, {
              filename: "data",
              excludeColumns: ["select", "actions"],
            })
          }
          className="gap-2"
        >
          <Download className="size-4" aria-hidden="true" />
          {t("Export")}
        </Button> */}
      </div>
      <div className="flex flex-wrap items-center">
        {searchableColumns.length > 0 &&
          searchableColumns.map(
            (column) =>
              table.getColumn(column.id ? String(column.id) : "") && (
                <Input
                  key={String(column.id)}
                  placeholder={column.placeholder}
                  value={
                    (table
                      .getColumn(String(column.id))
                      ?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table
                      .getColumn(String(column.id))
                      ?.setFilterValue(event.target.value)
                  }
                  className={cn(
                    "h-10 w-40 bg-custom_2-tertiary text-white lg:w-64",
                    "placeholder:text-white"
                  )}
                />
              )
          )}
        {isFiltered && (
          <Button
            aria-label="Reset filters"
            variant="ghost"
            className="h-8 px-2 lg:px-3"
            onClick={() => table.resetColumnFilters()}
          >
            {locale === "ar" ? "إعادة تعيين" : "Reset"}
            <X className="ml-2 size-4" aria-hidden="true" />
          </Button>
        )}
      </div>
      <div
        className={cn(
          "flex w-full items-center justify-between gap-2 py-2",
          className
        )}
      >
        <div className="flex flex-1 items-center gap-2">
          <form
            className="relative"
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.currentTarget.elements.namedItem(
                "globalFilter"
              ) as HTMLInputElement;
              table.setGlobalFilter(String(input.value));
            }}
          >
            <Input
              key="All"
              name="globalFilter"
              defaultValue={table.getState().globalFilter}
              placeholder={t("Search")}
              className={cn(
                "h-16 w-40 bg-white text-primary shadow-lg lg:w-64",
                "focus:border-none focus:outline-none"
              )}
            />
            <Icon
              icon="icon-park-solid:enter-key"
              width="20"
              height="20"
              className={cn(
                "absolute top-6 flex items-center justify-center text-primary opacity-40",
                {
                  "right-16": locale === "en",
                  "left-16": locale === "ar",
                }
              )}
            />
            <Button
              type="submit"
              variant="ghost"
              className={cn(
                "absolute top-1/2 -translate-y-1/2 text-white",
                {
                  "left-2": locale === "ar",
                  "right-2": locale === "en",
                },
                "bg-primary/70"
              )}
            >
              <Search className="size-1" aria-hidden="true" />
            </Button>
          </form>
          {filterableColumns.length > 0 &&
            filterableColumns.map(
              (column) =>
                table.getColumn(column.id ? String(column.id) : "") && (
                  <DataTableFacetedFilter
                    key={String(column.id)}
                    column={table.getColumn(column.id ? String(column.id) : "")}
                    title={column.label}
                    options={column.options ?? []}
                  />
                )
            )}
        </div>

        <div
          className={cn(
            "w-full rounded-md bg-white px-4 py-2",
            "flex items-center justify-between shadow-lg"
          )}
        >
          <div>
            <p className="text-sm leading-6 text-primary">
              {t("SearchResult")}
            </p>
            <div className="flex items-center gap-1 font-semibold text-primary">
              <Icon icon="ic:round-person-2" width="24" height="24" />
              {table.getRowCount()}
              <p> {t("Items")}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
