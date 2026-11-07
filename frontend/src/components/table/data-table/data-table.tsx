import * as React from "react";

import { type Table as TanstackTable, flexRender } from "@tanstack/react-table";
import { Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { RotatingLines } from "react-loader-spinner";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { getCommonPinningStyles } from "../lib/data-table";
import { exportTableToCSV } from "../lib/export";
import { DataTableAdvancedToolbar } from "./data-table-advanced-toolbar";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The table instance returned from useDataTable hook with pagination, sorting, filtering, etc.
   * @type TanstackTable<TData>
   */
  table: TanstackTable<TData>;

  isLoading?: boolean;
  isError?: boolean;

  /**
   * The floating bar to render at the bottom of the table on row selection.
   * @default null
   * @type React.ReactNode | null
   * @example floatingBar={<TasksTableFloatingBar table={table} />}
   */
  floatingBar?: React.ReactNode | null;

  advancedFilterFields: any;
}

export function DataTable<TData>({
  table,
  floatingBar = null,
  children,
  className,
  isLoading = false,
  advancedFilterFields,
  isError = false,
  ...props
}: DataTableProps<TData>) {
  const t = useTranslations("TableConfig");

  return (
    <div className={cn("w-full space-y-2.5", className)} {...props}>
      {children}
      <div className="rounded-md bg-white shadow-lg">
        <div className="flex w-full justify-between gap-2 p-0.5">
          <div className="w-full">
            <DataTableAdvancedToolbar
              table={table}
              filterFields={advancedFilterFields}
              shallow={false}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() =>
                exportTableToCSV(table, {
                  filename: "data",
                  excludeColumns: ["select", "actions"],
                })
              }
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <Download className="size-4" aria-hidden="true" />
              {t("Export")}
            </Button>
            <DataTableViewOptions table={table} />
          </div>
        </div>
        <Table
          className="w-full bg-white"
          style={{
            boxShadow: "rgba(var(--primary-color), 0.1) 0px 10px 34px 0px",
          }}
        >
          <TableHeader className="">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                className="bg-primary/10 text-base font-medium leading-[33.73px]"
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{
                        ...getCommonPinningStyles({
                          column: header.column,
                          rowIndex: 1,
                          locale: "ar", // You might want to get this from useLocale hook
                        }),
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="">
            <TableRow
              className={cn(
                isLoading && "absolute inset-0 z-30 bg-[#ffffff56]",
                !isLoading && "hidden"
              )}
            >
              <TableCell
                colSpan={table.getAllColumns().length}
                className="flex h-full w-full items-center justify-center text-center"
              >
                <RotatingLines
                  visible={true}
                  width="60"
                  strokeWidth="5"
                  animationDuration="0.75"
                  ariaLabel="rotating-lines-loading"
                  strokeColor="#8355A0"
                />
              </TableCell>
            </TableRow>
            {isError ? (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length}>
                  <div className="flex items-center justify-center">
                    <p>{t("There is an error")}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        ...getCommonPinningStyles({
                          column: cell.column,
                          rowIndex: index,
                          locale: "en", // You might want to get this from useLocale hook
                        }),
                      }}
                      className="text-sm font-normal text-[#FFFFFFCC]"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  {t("NoResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="footer flex flex-col gap-2.5">
        <DataTablePagination table={table} />
        {table.getFilteredSelectedRowModel().rows.length > 0 && floatingBar}
      </div>
    </div>
  );
}
