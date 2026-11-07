import type { Row } from "@tanstack/react-table";

import { DataTableConfig } from "@/components/table/configs/data-table";
import { Link } from "@/i18n/routing";

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
        : never;
    }[keyof T]
  : never;

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

// export interface Option {
//   label: string;
//   value: string;
//   icon?: React.ComponentType<{ className?: string }>;
//   count?: number;
// }

// export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, "id"> {
//   id: NestedKeyOf<TData>;
// }

export type StringKeyOf<TData> = Extract<keyof TData, string>;

// export type ExtendedSortingState<TData> = ExtendedColumnSort<TData>[];

export type ColumnType = DataTableConfig["columnTypes"][number];

// export type FilterOperator = DataTableConfig["globalOperators"][number];

// export type JoinOperator = DataTableConfig["joinOperators"][number]["value"];

// export interface DataTableFilterField<TData> {
//   id: NestedKeyOf<TData> | "All";
//   label: string;
//   placeholder?: string;
//   options?: Option[];
// }

// export interface DataTableAdvancedFilterField<TData>
//   extends DataTableFilterField<TData> {
//   type: ColumnType;
//   relationOperator?: "some" | "every" | "none";
// }

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

// export type ActionButtonsType =
//   | LinkActionButton
//   | ButtonActionButton
//   | ComponentActionButton;

// export type Filter<TData> = Prettify<
//   Omit<z.infer<typeof filterSchema>, "id"> & {
//     id: NestedKeyOf<TData>;
//   }
// >;

export interface DataTableRowAction<TData> {
  row: Row<TData>;
  type: "update" | "delete";
}

export interface LinksType {
  id: string;
  title: string;
  imgUrl?: string;
  url?: string;
  icon: string;
  action?: string[];
  urls?: {
    id: string;
    title: string;
    url: string;
    action: string[];
  }[];
}
