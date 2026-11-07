"use client";

import * as React from "react";

import { Column } from "@tanstack/react-table";
import { Check, ChevronsUpDown, Settings2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { toSentenceCase } from "@/components/table/lib/utils-table";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { useTableSettings } from "../store/table-settings-store";

interface DataTableViewOptionsProps<TData> {
  columns: Column<TData, unknown>[];
  tableId: string;
}

function DataTableViewOptions<TData>({
  columns,
  tableId,
}: DataTableViewOptionsProps<TData>) {
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const t = useTranslations();
  const { setColumnVisibility } = useTableSettings();
  const settings = useTableSettings((state) => state.tables[tableId]) ?? {
    columnVisibility: {},
  };

  const toggleColumn = React.useCallback(
    (column: Column<TData, unknown>) => {
      const newVisibility = {
        ...settings.columnVisibility,
        [column.id]: !column.getIsVisible(),
      };
      setColumnVisibility(tableId, newVisibility);
      column.toggleVisibility(!column.getIsVisible());
    },
    [settings.columnVisibility, setColumnVisibility, tableId]
  );

  const hideAllColumns = React.useCallback(() => {
    const newVisibility: Record<string, boolean> = {};
    columns.forEach((column) => {
      newVisibility[column.id] = false;
      column.toggleVisibility(false);
    });
    setColumnVisibility(tableId, newVisibility);
  }, [columns, setColumnVisibility, tableId]);

  const showAllColumns = React.useCallback(() => {
    const newVisibility: Record<string, boolean> = {};
    columns.forEach((column) => {
      newVisibility[column.id] = true;
      column.toggleVisibility(true);
    });
    setColumnVisibility(tableId, newVisibility);
  }, [columns, setColumnVisibility, tableId]);

  const allColumnsVisible = React.useMemo(() => {
    return columns.every((column) => column.getIsVisible());
  }, [columns, settings.columnVisibility]);

  const allColumnsHidden = React.useMemo(() => {
    return columns.every((column) => !column.getIsVisible());
  }, [columns, settings.columnVisibility]);

  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          aria-label="Toggle columns"
          variant="ghost"
          role="combobox"
          size="sm"
        >
          <Settings2 className="size-4" />
          {t("View")}
          <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-44 p-0"
        onCloseAutoFocus={() => triggerRef.current?.focus()}
      >
        <Command>
          <CommandInput placeholder={t("SearchColumns")} />
          <CommandList>
            <CommandEmpty>{t("NoColumnsFound")}</CommandEmpty>
            <CommandGroup>
              {!allColumnsHidden && (
                <CommandItem onSelect={hideAllColumns}>
                  <span className="truncate">{t("HideAllColumns")}</span>
                </CommandItem>
              )}
              {!allColumnsVisible && (
                <CommandItem onSelect={showAllColumns}>
                  <span className="truncate">{t("ShowAllColumns")}</span>
                </CommandItem>
              )}
              {columns.map((column) => {
                return (
                  <CommandItem
                    key={column.id}
                    onSelect={() => toggleColumn(column)}
                  >
                    <span className="truncate">
                      {toSentenceCase(
                        t(column.columnDef.headerName ?? column.id)
                      )}
                    </span>
                    <Check
                      className={cn(
                        "ml-auto size-4 shrink-0",
                        column.getIsVisible() ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default React.memo(DataTableViewOptions) as typeof DataTableViewOptions;
