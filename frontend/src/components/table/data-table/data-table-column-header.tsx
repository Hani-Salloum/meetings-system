"use client";

import { SelectIcon } from "@radix-ui/react-select";
import { type Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const t = useTranslations("TableConfig");
  if (!column.getCanSort() && !column.getCanHide()) {
    return (
      <div
        className={cn(
          "text-start text-sm font-normal text-muted-foreground",
          className
        )}
      >
        {title}
      </div>
    );
  }

  const ascValue = `${column.id}-asc`;
  const descValue = `${column.id}-desc`;
  const hideValue = `${column.id}-hide`;

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Select
        value={
          column.getIsSorted() === "desc"
            ? descValue
            : column.getIsSorted() === "asc"
              ? ascValue
              : undefined
        }
        onValueChange={(value) => {
          if (value === ascValue) column.toggleSorting(false);
          else if (value === descValue) column.toggleSorting(true);
          else if (value === hideValue) column.toggleVisibility(false);
        }}
      >
        <SelectTrigger
          aria-label={
            column.getIsSorted() === "desc"
              ? "Sorted descending. Click to sort ascending."
              : column.getIsSorted() === "asc"
                ? "Sorted ascending. Click to sort descending."
                : "Not sorted. Click to sort ascending."
          }
          className={cn(
            "-mx-3 h-8 w-fit border-none text-base hover:bg-custom_2-fourth hover:text-white data-[state=open]:bg-primary data-[state=open]:text-white [&>svg:last-child]:hidden",
            "flex items-center gap-2 font-normal text-muted-foreground shadow-none"
          )}
        >
          {title}
          <SelectIcon asChild>
            {column.getCanSort() &&
            column.id !== "actions" &&
            column.getIsSorted() === "desc" ? (
              <ArrowDown className="size-3" aria-hidden="true" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp className="size-3" aria-hidden="true" />
            ) : (
              <ChevronsUpDown className="size-3" aria-hidden="true" />
            )}
          </SelectIcon>
        </SelectTrigger>
        <SelectContent align="start">
          {column.getCanSort() && column.id !== "actions" && (
            <>
              <SelectItem value={ascValue}>
                <span className="flex items-center">
                  <ArrowUp
                    className="mr-2 size-3.5 text-muted-foreground/70"
                    aria-hidden="true"
                  />
                  {t("Asc")}
                </span>
              </SelectItem>
              <SelectItem value={descValue}>
                <span className="flex items-center">
                  <ArrowDown
                    className="mr-2 size-3.5 text-muted-foreground/70"
                    aria-hidden="true"
                  />
                  {t("Desc")}
                </span>
              </SelectItem>
            </>
          )}
          {column.getCanHide() && (
            <SelectItem value={hideValue}>
              <span className="flex items-center">
                <EyeOff
                  className="mr-2 size-3.5 text-muted-foreground/70"
                  aria-hidden="true"
                />
                {t("Hide")}
              </span>
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
