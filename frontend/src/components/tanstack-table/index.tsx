"use client";

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";

import { ColumnResizeDirection, Table } from "@tanstack/react-table";
import { useLocale } from "next-intl";

import { Checkbox } from "@/components/ui/checkbox";

import { useDataTable } from "../table/hooks/use-data-table";
import AdditionalButtons from "./components/additional-buttons";
import SearchAndButtons from "./components/search-and-buttons";
import TableContent from "./components/table-content";
import TableToolbars from "./components/table-toolbars";
import { useTableSettings } from "./store/table-settings-store";
import {
  ActionButtonsType,
  DataTableAdvancedFilterField,
  TableProps,
  TableSearchParams,
} from "./types/table";

const fallbackData: any[] = [];
const fallbackQueryKey: string[] = [];
const fallbackActionButtons: ActionButtonsType[] = [];

const CheckboxHeader = memo(({ table }: { table: any }) => {
  const handleSelectAll = useCallback(
    (value: boolean) => {
      table.toggleAllPageRowsSelected(!!value);
    },
    [table]
  );

  return (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && "indeterminate")
      }
      onCheckedChange={handleSelectAll}
      aria-label="Select all"
      className="translate-y-0.5"
    />
  );
});

CheckboxHeader.displayName = "CheckboxHeader";

const CheckboxCell = memo(({ row }: { row: any }) => {
  const [_, setTick] = useState(0);

  const forceRender = useCallback(() => setTick((x) => x + 1), []);

  const handleRowSelect = useCallback(
    (value: boolean) => {
      row.toggleSelected(!!value);
      forceRender();
    },
    [row, forceRender]
  );

  return (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={handleRowSelect}
      aria-label="Select row"
      className="translate-y-0.5"
    />
  );
});

CheckboxCell.displayName = "CheckboxCell";

const TableContainer = memo(({ children }: { children: React.ReactNode }) => (
  <div className="relative rounded-lg bg-card/70 shadow-lg dark:bg-primary/30">
    {children}
  </div>
));

TableContainer.displayName = "TableContainer";

function TanstackTable<TData>(props: TableProps<TData>) {
  const { tables, initTable } = useTableSettings();

  useEffect(() => {
    initTable(props.id);
  }, [props.id, initTable]);

  const settings = tables[props.id] ?? {
    columnVisibility: {},
    pageSize: 10,
    sorting: [],
    columnPinning: {},
    columnOrder: [],
  };

  const locale = useLocale();

  const [isPending, startTransition] = useTransition();

  const columnResizeDirection = useMemo<ColumnResizeDirection>(
    () => (locale === "ar" ? "rtl" : "ltr"),
    [locale]
  );

  const checkboxColumn = useMemo(
    () => ({
      id: "Select",
      header: ({ table }: { table: Table<TData> }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5 border-gray-300 dark:border-gray-500"
        />
      ),
      cell: ({ row }: any) => {
        const [_, setTick] = useState(0);

        const forceRender = useCallback(() => setTick((x) => x + 1), []);

        const handleRowSelect = useCallback(
          (value: boolean) => {
            row.toggleSelected(!!value);
            forceRender();
          },
          [row, forceRender]
        );

        return (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={handleRowSelect}
            aria-label="Select row"
            className="translate-y-0.5 border-gray-300 dark:border-gray-500"
          />
        );
      },
      enableColumnFilter: false,
      enableSorting: false,
      enableHiding: false,
      size: 30,
    }),
    [locale]
  );

  const baseColumns = useMemo(() => {
    return props.columns?.map((col) => {
      const accessorKey = col.accessorKey || col.id;
      const columnId = accessorKey || col.id || "column";

      let enableColumnFilter: boolean;
      if (props.defaultFilterMode === "all") {
        enableColumnFilter = col.enableColumnFilter !== false;
      } else if (props.defaultFilterMode === "none") {
        enableColumnFilter = col.enableColumnFilter === true;
      } else {
        enableColumnFilter = col.enableColumnFilter ?? true;
      }

      return {
        ...col,
        id: columnId,
        accessorKey,
        accessorFn:
          // @ts-expect-error accessorFn is not always defined
          col.accessorFn || ((row: TData) => row[accessorKey as keyof TData]),
        enableColumnFilter,
      };
    });
  }, [props.columns, props.defaultFilterMode]);

  const columns = useMemo(() => {
    if (props.enableCheckBox) {
      return [checkboxColumn, ...baseColumns];
    }
    return baseColumns;
  }, [props.enableCheckBox, checkboxColumn, baseColumns]);

  const dataTableConfig = useMemo(
    () => ({
      tableId: props.id,
      data: props.data ?? fallbackData,
      columns: columns,
      pageCount: props.pageCount ?? 0,
      enableAdvancedFilter: true,
      shallow: false,
      startTransition,
      clearOnDefault: true,
      columnResizeDirection,
      getRowId: (originalRow: any) => originalRow.id,
      columnVisibility: settings.columnVisibility,
      columnPinning: settings.columnPinning,
    }),
    [
      props.id,
      props.data,
      columns,
      props.pageCount,
      startTransition,
      columnResizeDirection,
      settings.columnVisibility,
      settings.columnPinning,
    ]
  );

  const { table } = useDataTable<TData>(dataTableConfig);

  const defaultAdvancedFilterFields: DataTableAdvancedFilterField<TData>[] =
    useMemo(() => {
      return props.columns
        .filter((col) => {
          if (props.defaultFilterMode === "all") {
            return col.enableColumnFilter !== false && col.accessorKey;
          } else if (props.defaultFilterMode === "none") {
            return col.enableColumnFilter === true && col.accessorKey;
          }
          return col.enableColumnFilter !== false && col.accessorKey;
        })
        .map((col) => ({
          id: col.accessorKey ?? "",
          label: col.headerName ?? col.filterKey ?? col.accessorKey ?? "",
          type: col.type ?? "text",
          ...(col.relationOperator && {
            relationOperator: col.relationOperator,
          }),
          ...(["select", "multi-select"].includes(col.type ?? "") && {
            options: col.options,
          }),
        }));
    }, [props.columns, props.defaultFilterMode]);

  const combinedAdvancedFilterFields = useMemo(
    () => [
      ...defaultAdvancedFilterFields,
      ...(props.advancedFilterFields || []),
    ],
    [defaultAdvancedFilterFields, props.advancedFilterFields]
  );

  const handleRefetch = useCallback(() => {
    if (props.refetch) {
      props.refetch({} as TableSearchParams<TData>);
    }
  }, [props.refetch]);

  const isLoading = useMemo(
    () => isPending || props.isLoading,
    [isPending, props.isLoading]
  );

  const tableContentProps = useMemo(
    () => ({
      table,
      tableId: props.id,
      isLoading,
      columnResizeMode: "onChange" as const,
      rowSelection: table.getState().rowSelection,
      rowSelectionAll: table.getIsSomeRowsSelected(),
      columnOrder: table.getState().columnOrder,
    }),
    [
      table,
      props.id,
      isLoading,
      table.getIsSomeRowsSelected(),
      table.getState().rowSelection,
      table.getState().columnOrder,
    ]
  );

  return (
    <div>
      <div className="mb-4 flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <AdditionalButtons
          ActionButtons={props.ActionButtons ?? fallbackActionButtons}
        />
        <SearchAndButtons<TData> table={table} />
      </div>
      <TableContainer>
        <TableToolbars
          table={table}
          refetch={handleRefetch}
          advancedFilterFields={combinedAdvancedFilterFields}
          tableId={props.id}
        />
        <TableContent {...tableContentProps} />
      </TableContainer>
    </div>
  );
}

export default memo(TanstackTable) as <TData>(
  props: TableProps<TData>
) => JSX.Element;
