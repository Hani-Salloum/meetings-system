import type { ColumnSort, Row } from "@tanstack/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { type z } from "zod";

import { DataTableConfig } from "@/components/table/configs/data-table";
import { type filterSchema } from "@/components/table/lib/parsers";
import { Link, Locale } from "@/i18n/routing";

import { TableSearchParams } from "../table";

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type AdvanceColumnDef<TData> = ColumnDef<TData> & {
  headerName?: string;
};

export interface TableProps<TData> {
  data: TData[];
  pageCount?: number;
  filterFields?: DataTableFilterField<TData>[];
  advancedFilterFields?: DataTableAdvancedFilterField<TData>[];
  ActionButtons?: ActionButtonsType[];
  getColumns: AdvanceColumnDef<TData>[] | (() => AdvanceColumnDef<TData>[]);
  onDelete?: (selectedRows: TData[]) => void;
  isLoading?: boolean;
  isError?: boolean;
  refetch?: (searchParams: TableSearchParams<TData>) => void;
  withoutToolbar?: boolean;
  shallow?: boolean;
}
export interface BaseActionButton {
  title: string;
  type: "button" | "link" | "component";
}

export interface LinkActionButton extends BaseActionButton {
  type: "link";
  // Get the href param type from Link component
  href: Parameters<typeof Link>[0]["href"];
}

export interface ButtonActionButton extends BaseActionButton {
  type: "button";
  href?: never;
  onClick?: () => void;
}
export interface ComponentActionButton extends BaseActionButton {
  type: "component";
  component: React.ReactNode;
}
export type ActionButtonsType =
  | LinkActionButton
  | ButtonActionButton
  | ComponentActionButton;

export type ColumnType = DataTableConfig["columnTypes"][number];

export interface TableDialogProps<TData> {
  data: TData[];
  pageCount?: number;
  locale: Locale;
  // filterFields?: DataTableFilterField<TData>[];
  // advancedFilterFields?: DataTableAdvancedFilterField<TData>[];
  // ActionButtons?: ActionButtonsType[];
  getColumns: AdvanceColumnDef<TData>[] | (() => AdvanceColumnDef<TData>[]);
  // onDelete?: (selectedRows: TData[]) => void;
  // isLoading?: boolean;
  // isError?: boolean;
  // refetch?: any;
  // withoutToolbar?: boolean;
}

export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number;
}

export type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
        : never;
    }[keyof T]
  : never;
export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, "id"> {
  id: NestedKeyOf<TData>;
}
export interface DataTableFilterField<TData> {
  id: NestedKeyOf<TData> | "All";
  label: string;
  placeholder?: string;
  options?: Option[];
}

export interface DataTableAdvancedFilterField<TData>
  extends DataTableFilterField<TData> {
  type: ColumnType;
  relationOperator?: "some" | "every" | "none";
}
export type Filter<TData> = Prettify<
  Omit<z.infer<typeof filterSchema>, "id"> & {
    id: NestedKeyOf<TData>;
  }
>;
export interface DataTableRowAction<TData> {
  row: Row<TData>;
  type: "update" | "delete";
}
export type ExtendedSortingState<TData> = ExtendedColumnSort<TData>[];

export type JoinOperator = DataTableConfig["joinOperators"][number]["value"];

export type FilterOperator = DataTableConfig["globalOperators"][number];
export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number;
}
