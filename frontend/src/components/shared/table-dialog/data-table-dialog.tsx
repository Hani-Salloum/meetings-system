import React from "react";

import { type Table as TanstackTable, flexRender } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { getCommonPinningStyles } from "@/components/table/lib/data-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface DataTableDialog<TData> extends React.HTMLAttributes<HTMLDivElement> {
  table: TanstackTable<TData>;
}

export default function DataTableDialog<TData>({
  table,
  className,
  ...props
}: DataTableDialog<TData>) {
  const t = useTranslations("TableConfig");

  return (
    <div
      className={cn(
        "max-h-[50vh] w-full space-y-2.5 overflow-y-auto shadow-lg",
        className
      )}
      {...props}
    >
      <Table
        className="w-full"
        style={{
          boxShadow: "rgba(var(--primary-color), 0.1) 0px 10px 34px 0px",
        }}
      >
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              className="bg-primary/10 text-lg font-medium leading-[33.73px]"
              key={headerGroup.id}
            >
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  style={{
                    ...getCommonPinningStyles({
                      column: header.column,
                      rowIndex: 1,
                      locale: "en", // You might want to get this from useLocale hook
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
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
                {" "}
                {t("NoResults")}
              </TableCell>
            </TableRow>
          )}
          <TableRow />
        </TableBody>
      </Table>
    </div>
  );
}
