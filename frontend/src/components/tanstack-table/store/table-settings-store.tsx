import type { Updater } from "@tanstack/react-table";
import { ColumnPinningState, VisibilityState } from "@tanstack/react-table";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type SingleTableSettings = {
  columnVisibility: VisibilityState;
  pageSize: number;
  sorting: any[];
  columnPinning: ColumnPinningState;
  columnOrder: string[];
};

export type TableSettingsState = {
  tables: Record<string, SingleTableSettings>;
};

export type TableSettingsActions = {
  initTable: (tableId: string) => void;
  setColumnVisibility: (tableId: string, v: Updater<VisibilityState>) => void;
  setPageSize: (tableId: string, size: number) => void;
  setSorting: (tableId: string, s: any[]) => void;
  setColumnPinning: (tableId: string, v: Updater<ColumnPinningState>) => void;
  setColumnOrder: (tableId: string, order: string[]) => void;
};

export type TableSettingsStore = TableSettingsState & TableSettingsActions;

const defaultTableSettings: SingleTableSettings = {
  columnVisibility: {},
  pageSize: 10,
  sorting: [],
  columnPinning: {},
  columnOrder: [],
};

export const useTableSettings = create<TableSettingsStore>()(
  devtools(
    persist(
      (set, get) => ({
        tables: {},

        initTable: (tableId) =>
          set((state) => {
            if (state.tables[tableId]) return state;
            return {
              tables: {
                ...state.tables,
                [tableId]: { ...defaultTableSettings },
              },
            };
          }),

        setColumnVisibility: (tableId, v) =>
          set((state) => {
            const prev = state.tables[tableId]?.columnVisibility ?? {};
            return {
              tables: {
                ...state.tables,
                [tableId]: {
                  ...state.tables[tableId],
                  columnVisibility: typeof v === "function" ? v(prev) : v,
                },
              },
            };
          }),

        setPageSize: (tableId, size) =>
          set((state) => ({
            tables: {
              ...state.tables,
              [tableId]: {
                ...state.tables[tableId],
                pageSize: size,
              },
            },
          })),

        setSorting: (tableId, s) =>
          set((state) => ({
            tables: {
              ...state.tables,
              [tableId]: {
                ...state.tables[tableId],
                sorting: s,
              },
            },
          })),

        setColumnPinning: (tableId, v) =>
          set((state) => {
            const prev = state.tables[tableId]?.columnPinning ?? {};
            return {
              tables: {
                ...state.tables,
                [tableId]: {
                  ...state.tables[tableId],
                  columnPinning: typeof v === "function" ? v(prev) : v,
                },
              },
            };
          }),

        setColumnOrder: (tableId, order) =>
          set((state) => ({
            tables: {
              ...state.tables,
              [tableId]: {
                ...state.tables[tableId],
                columnOrder: order,
              },
            },
          })),
      }),
      {
        name: "multi-table-settings",
      }
    )
  )
);
