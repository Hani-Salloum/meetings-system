import { useMemo } from "react";

import { useTranslations } from "next-intl";

import { DataTableColumnHeader } from "@/components/table/data-table/data-table-column-header";
import { useDataTable } from "@/components/table/hooks/use-data-table";
import { TableDialogProps } from "@/components/table/types/table";

import DataTableDialog from "./data-table-dialog";

export default function TableDialog<TData extends { id: string | number }>(
  props: TableDialogProps<TData> & {
    pageSize: number;
    onPageChange: (page: number) => void;
    currentPage: number;
  }
) {
  const { data, pageCount = 10, getColumns } = props;

  const t = useTranslations();

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
            // @ts-expect-error accessorFn is not always defined
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
    // pageSize: pageSize,
    // onPageChange: onPageChange,
    // currentPage: currentPage,
    shallow: false,
    clearOnDefault: true,
    columnResizeDirection: "ltr",
    tableId: "table-dialog",
  });

  return (
    <div className="space-y-4">
      <DataTableDialog table={table} className="rounded-md border" />
    </div>
  );
}
