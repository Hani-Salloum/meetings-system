import "@tanstack/table-core/build/lib/types";

/* eslint-disable @typescript-eslint/no-unused-vars */

// Extend the existing ColumnDefBase interface to include the 'type' property
declare module "@tanstack/react-table" {
  interface ColumnDefBase<TData extends RowData, TValue = unknown> {
    type?: "number" | "text" | "date" | "select" | "boolean" | "multi-select";
    options?: {
      label: string;
      value: string;
    }[];
    relationOperator?: "some" | "every" | "none";
    headerName?: string;
    filterKey?: string;
    accessorKey?: any;
  }
}
