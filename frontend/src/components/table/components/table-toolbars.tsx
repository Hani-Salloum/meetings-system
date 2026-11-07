"use client";

import * as React from "react";

import { RefreshCcw } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import ShinyButton from "@/components/ui/shiny-button";
import { Link } from "@/i18n/routing";
import type {
  ActionButtonsType,
  DataTableAdvancedFilterField,
  DataTableFilterField,
} from "../types/table.ts";

import { DataTableToolbar } from "../data-table/data-table-toolbar";

interface TableToolbarsProps<TData> {
  table: any;
  locale: any;
  filterFields?: DataTableFilterField<TData>[];
  advancedFilterFields?: DataTableAdvancedFilterField<TData>[];
  ActionButtons?: ActionButtonsType[];
  onDelete?: (selectedRows: TData[]) => void;
  refetch: () => void;
}

export function TableToolbars<TData>(props: TableToolbarsProps<TData>) {
  const { table, locale, filterFields, ActionButtons, onDelete, refetch } =
    props;

  const [revalidatingTable, startTableTransition] = React.useTransition();
  const t = useTranslations();

  return (
    <DataTableToolbar
      locale={locale}
      table={table}
      filterFields={filterFields}
      onDelete={onDelete}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() =>
          startTableTransition(() => {
            refetch();
          })
        }
        disabled={revalidatingTable}
      >
        <RefreshCcw className="size-4" aria-hidden="true" />
        {t("Refresh")}
      </Button>
      {ActionButtons?.map((button, index) => (
        <React.Fragment key={`${button.type}_${index}`}>
          {button.type === "link" ? (
            <Link href={button.href}>
              <ShinyButton className="rounded-md bg-custom_2-primary px-3 py-1">
                <span className="text-sm font-normal text-white">
                  <p>{button.title}</p>
                </span>
              </ShinyButton>
            </Link>
          ) : button.type === "component" ? (
            button.component
          ) : (
            <ShinyButton
              className="rounded-md bg-custom_2-primary px-3 py-1"
              onClick={button.onClick}
            >
              <span className="text-sm font-normal text-white">
                <p>{button.title}</p>
              </span>
            </ShinyButton>
          )}
        </React.Fragment>
      ))}
    </DataTableToolbar>
  );
}
