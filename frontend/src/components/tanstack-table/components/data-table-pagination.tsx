import { startTransition } from "react";

import { type Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useProgress } from "react-transition-progress";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pageSizeOptions?: number[];
  onPagesizeChange?: () => void;
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [1, 3, 5, 10, 20, 30, 40, 50, 100, 5000],
  onPagesizeChange,
}: DataTablePaginationProps<TData>) {
  const t = useTranslations("TableConfig");
  const progress = useProgress();

  return (
    <div
      className={cn(
        "w-full flex-col-reverse justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8",
        "px-5",
        "flex items-center gap-2"
      )}
    >
      <div className="flex-1 whitespace-nowrap text-sm">
        {table.getFilteredSelectedRowModel().rows.length} {t("of")}{" "}
        {table.getFilteredRowModel().rows.length} {t("Row")}
      </div>

      <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
        <div className="flex items-center gap-2 space-x-2">
          <p className="flex items-center gap-2 whitespace-nowrap text-sm font-medium">
            {t("RowsPerPage")}
          </p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              startTransition(() => {
                progress();
                table.setPageSize(Number(value));
                // Call onPagesizeChange callback when pagesize changes
                if (onPagesizeChange) {
                  onPagesizeChange();
                }
              });
            }}
          >
            <SelectTrigger className="h-8 w-[4.5rem]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div
          className={cn(
            "flex items-center justify-center text-sm font-medium",
            ""
          )}
        >
          {t("Page")} {table.getState().pagination.pageIndex + 1} {t("of")}{" "}
          {table.getPageCount()}
        </div>
        <div
          dir="ltr"
          className={cn(
            "flex items-center space-x-2",
            "rounded-md px-2 py-0.5"
          )}
        >
          <Button
            type="button"
            aria-label="Go to first page"
            variant="link"
            className="hidden size-8 p-0 lg:flex"
            onClick={() =>
              startTransition(() => {
                progress();
                table.setPageIndex(0);
              })
            }
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="size-4" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            aria-label="Go to previous page"
            variant="link"
            size="icon"
            className="size-8"
            onClick={() =>
              startTransition(() => {
                progress();
                table.previousPage();
              })
            }
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            aria-label="Go to next page"
            variant="link"
            size="icon"
            className="size-8"
            onClick={() =>
              startTransition(() => {
                table.nextPage();
                progress();
              })
            }
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            aria-label="Go to last page"
            variant="link"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() =>
              startTransition(() => {
                progress();
                table.setPageIndex(table.getPageCount() - 1);
              })
            }
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
