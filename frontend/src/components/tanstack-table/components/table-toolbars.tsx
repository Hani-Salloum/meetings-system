import { memo } from "react";

import { Table } from "@tanstack/react-table";
import { RefreshCcw } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

import { DataTableAdvancedFilterField } from "../types/table";
import { DataTableAdvancedToolbar } from "./data-table-advanced-toolbar";
import DataTableViewOptions from "./data-table-view-options";

interface TableToolbarsProps<TData> {
  table: Table<TData>;
  advancedFilterFields: DataTableAdvancedFilterField<TData>[];
  refetch: () => void;
  tableId: string;
}

function TableToolbars<TData>({
  table,
  advancedFilterFields,
  refetch,
  tableId,
}: TableToolbarsProps<TData>) {
  const t = useTranslations();

  return (
    <div className="ml-0 sm:ml-3">
      <div className="flex w-full justify-between gap-1 p-0.5 sm:gap-2">
        <div className="w-full">
          <DataTableAdvancedToolbar
            table={table}
            filterFields={advancedFilterFields}
            tableId={tableId}
          />
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <DataTableViewOptions
            columns={table.getAllColumns()}
            tableId={tableId}
          />
          <Button variant="ghost" size="sm" onClick={refetch}>
            <RefreshCcw className="size-4" aria-hidden="true" />
            {t("Refresh")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default memo(TableToolbars) as typeof TableToolbars;
