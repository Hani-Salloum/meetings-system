"use client";

import * as React from "react";
import { useCallback, useState } from "react";

import { Column } from "@tanstack/react-table";
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  FilterIcon,
  Search,
  X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { parseAsInteger, useQueryState } from "nuqs";

import {
  getDefaultFilterOperator,
  getFilterOperators,
} from "@/components/table/lib/data-table";
import { getFiltersStateParser } from "@/components/table/lib/parsers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { Filter, FilterOperator, NestedKeyOf } from "../types/table";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface ColumnFilterPopoverProps<TData> {
  column: Column<TData, any>;
  columnId: NestedKeyOf<TData>;
  columnLabel?: string;
  columnType?:
    | "text"
    | "number"
    | "date"
    | "boolean"
    | "select"
    | "multi-select";
  columnOptions?: { label: string; value: string }[];
  debounceMs?: number;
  shallow?: boolean;
  onUpdateFilter?: (value: string) => void;
  onCreateFilter?: (value: string) => void;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ColumnFilterPopover<TData>({
  column,
  columnId,
  columnLabel,
  columnOptions = [],
  debounceMs = 300,
  shallow = true,
  onUpdateFilter,
  onCreateFilter,
}: ColumnFilterPopoverProps<TData>) {
  // ============================================================================
  // HOOKS & TRANSLATIONS
  // ============================================================================

  const locale = useLocale();
  const t = useTranslations("TableConfig");
  const tGlobal = useTranslations();

  // ============================================================================
  // PAGE MANAGEMENT
  // ============================================================================

  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({
      clearOnDefault: true,
      shallow: true,
    })
  );

  const resetPageToFirst = React.useCallback(() => {
    if (page && page !== 1) {
      void setPage(1);
    }
  }, [page, setPage]);

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [filterValue, setFilterValue] = useState("");
  const [filterOperator, setFilterOperator] = useState<FilterOperator>(
    getDefaultFilterOperator(column.columnDef?.type ?? "text")
  );

  const [filters, setFilters] = useQueryState(
    "filters",
    getFiltersStateParser(column.getFacetedRowModel().rows[0]?.original)
      .withDefault([])
      .withOptions({
        clearOnDefault: true,
        shallow,
      })
  );

  // ============================================================================
  // DERIVED STATE
  // ============================================================================

  const existingFilter = filters?.find((filter) => filter.id === columnId);
  const availableOperators = getFilterOperators(
    column.columnDef?.type ?? "text"
  );

  const hasActiveFilter =
    existingFilter &&
    (existingFilter.operator === "isEmpty" ||
      existingFilter.operator === "isNotEmpty" ||
      (typeof existingFilter.value === "string" &&
        existingFilter.value.trim() !== ""));

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleUpdateFilter = useCallback(() => {
    // Remove filter if value is empty (except for isEmpty/isNotEmpty operators)
    if (
      !filterValue.trim() &&
      filterOperator !== "isEmpty" &&
      filterOperator !== "isNotEmpty"
    ) {
      if (existingFilter) {
        const updatedFilters =
          filters?.filter((filter) => filter.id !== columnId) || [];
        void setFilters(updatedFilters);
      }
      return;
    }

    const newFilter: Filter<TData> = {
      id: columnId,
      value: filterValue,
      type: column.columnDef?.type ?? "text",
      operator: filterOperator,
      rowId: existingFilter?.rowId || `col-${columnId}-${Date.now()}`,
    };

    // Update existing filter or add new one
    if (existingFilter) {
      const updatedFilters =
        filters?.map((filter: any) =>
          filter.id === columnId ? newFilter : filter
        ) || [];
      void setFilters(updatedFilters);
    } else {
      //@ts-expect-error
      const updatedFilters = [...(filters || []), newFilter];
      void setFilters(updatedFilters);
    }

    resetPageToFirst();

    // Call legacy callback if provided
    if (onUpdateFilter) {
      onUpdateFilter(filterValue);
    }
  }, [
    filterValue,
    filterOperator,
    existingFilter,
    filters,
    columnId,
    column.columnDef?.type ?? "text",
    setFilters,
    onUpdateFilter,
    resetPageToFirst,
  ]);

  const handleRemoveFilter = useCallback(() => {
    if (existingFilter) {
      const updatedFilters =
        filters?.filter((filter) => filter.id !== columnId) || [];
      void setFilters(updatedFilters);
    }
    setFilterValue("");
    resetPageToFirst();
  }, [existingFilter, filters, columnId, setFilters, resetPageToFirst]);

  const handleSearch = useCallback(() => {
    const newFilter: Filter<TData> = {
      id: columnId,
      value: filterValue,
      type: column.columnDef?.type ?? "text",
      operator: filterOperator,
      rowId: `col-${columnId}-${Date.now()}`,
    };

    void setFilters([newFilter]);
    resetPageToFirst();

    if (onCreateFilter) {
      onCreateFilter(filterValue);
    }
  }, [
    columnId,
    column.columnDef?.type ?? "text",
    filterValue,
    filterOperator,
    onCreateFilter,
    setFilters,
    resetPageToFirst,
  ]);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  React.useEffect(() => {
    if (existingFilter) {
      setFilterValue(
        typeof existingFilter.value === "string" ? existingFilter.value : ""
      );
      setFilterOperator(existingFilter.operator);
    } else {
      setFilterValue("");
      setFilterOperator(
        getDefaultFilterOperator(column.columnDef?.type ?? "text")
      );
    }
  }, [existingFilter, column.columnDef?.type]);

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderEmptyStateMessage = () => (
    <div className="rounded-md bg-muted p-2 text-sm text-muted-foreground">
      {filterOperator === "isEmpty"
        ? t("FilterEmptyValues")
        : t("FilterNonEmptyValues")}
    </div>
  );

  const renderTextNumberInput = () => (
    <Input
      id="filter-input"
      type={column.columnDef?.type ?? "text"}
      placeholder={t("EnterValue")}
      value={filterValue}
      onChange={(e) => setFilterValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleUpdateFilter();
        }
      }}
    />
  );

  const renderSelectInput = () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between"
          aria-label="Select option"
        >
          {filterValue
            ? column.columnDef?.options?.find(
                (option) => option.value === filterValue
              )?.label || filterValue
            : tGlobal("Select option")}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={tGlobal("Search options")} />
          <CommandList>
            <CommandEmpty>{tGlobal("No options found")}</CommandEmpty>
            <CommandGroup>
              {column.columnDef?.options?.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(value) => {
                    setFilterValue(value);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      filterValue === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );

  const renderMultiSelectInput = () => {
    const selectedValues = filterValue ? filterValue.split(",") : [];

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between"
            aria-label="Select multiple options"
          >
            {selectedValues.length > 0
              ? `${selectedValues.length} ${tGlobal("Selected")}`
              : tGlobal("Select options")}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={tGlobal("Search options")} />
            <CommandList>
              <CommandEmpty>{tGlobal("No options found")}</CommandEmpty>
              <CommandGroup>
                {column.columnDef?.options?.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(value) => {
                      const newSelectedValues = selectedValues.includes(value)
                        ? selectedValues.filter((v) => v !== value)
                        : [...selectedValues, value];
                      setFilterValue(newSelectedValues.join(","));
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedValues.includes(option.value)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  const renderDateInput = () => {
    const dateValue = filterValue ? new Date(filterValue) : undefined;

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
            aria-label="Select date"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateValue
              ? dateValue.toLocaleDateString()
              : tGlobal("Pick a date")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dateValue}
            onSelect={(date) => {
              setFilterValue(date?.toISOString() || "");
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    );
  };

  const renderBooleanInput = () => (
    <Select
      value={filterValue}
      onValueChange={(value) => setFilterValue(value)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={t("SelectBoolean")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="true">{tGlobal("True")}</SelectItem>
        <SelectItem value="false">{tGlobal("False")}</SelectItem>
      </SelectContent>
    </Select>
  );

  const renderFilterInput = () => {
    // Handle empty state operators
    if (filterOperator === "isEmpty" || filterOperator === "isNotEmpty") {
      return renderEmptyStateMessage();
    }

    // Render based on column type
    switch (column.columnDef?.type) {
      case "text":
      case "number":
        return renderTextNumberInput();

      case "select":
        return renderSelectInput();

      case "multi-select":
        return renderMultiSelectInput();

      case "date":
        return renderDateInput();

      case "boolean":
        return renderBooleanInput();

      default:
        return renderTextNumberInput();
    }
  };

  const renderFilterHeader = () => (
    <div className="flex items-center justify-between">
      <h4 className="flex items-center gap-1 font-medium">
        <span>{t("Filter")}</span>
        <span>{column.columnDef.headerName || columnId}</span>
      </h4>
      {hasActiveFilter && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemoveFilter}
          className="h-6 w-6 p-0"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );

  const renderOperatorSelector = () => (
    <div className="space-y-2">
      <label className="text-sm font-medium">{t("Operator")}</label>
      <Select
        value={filterOperator}
        onValueChange={(value: FilterOperator) => setFilterOperator(value)}
      >
        <SelectTrigger className="h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {availableOperators.map((op) => (
            <SelectItem key={op.value} value={op.value}>
              {op.label[locale as "en" | "ar"]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const renderValueInput = () => {
    const shouldShowValueInput =
      filterOperator !== "isEmpty" && filterOperator !== "isNotEmpty";

    if (!shouldShowValueInput) {
      return renderEmptyStateMessage();
    }

    return (
      <div className="space-y-2">
        <label htmlFor="filter-input" className="text-sm font-medium">
          {t("Value")}
        </label>
        {renderFilterInput()}
      </div>
    );
  };

  const renderActionButtons = () => {
    const isDisabled =
      !filterValue.trim() &&
      filterOperator !== "isEmpty" &&
      filterOperator !== "isNotEmpty";

    return (
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleUpdateFilter}
          className="flex-1"
          disabled={isDisabled}
        >
          <FilterIcon className="mr-2 h-4 w-4" />
          {existingFilter ? t("UpdateFilter") : t("ApplyFilter")}
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={handleSearch}
          className="flex-1"
          disabled={isDisabled}
        >
          <Search className="mr-2 h-4 w-4" />
          {t("Search")}
        </Button>
      </div>
    );
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "justify-start",
            hasActiveFilter && "bg-primary/10 text-primary-foreground"
          )}
        >
          <FilterIcon className="mr-2 h-4 w-4" />
          {t("Filter")}
          {hasActiveFilter && (
            <Badge
              variant="default"
              className="ml-2 h-4 w-4 rounded-full p-0 text-xs"
            >
              1
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-4">
        <div className="space-y-4">
          {renderFilterHeader()}

          <div className="space-y-3">
            {renderOperatorSelector()}
            {renderValueInput()}
          </div>

          {renderActionButtons()}
        </div>
      </PopoverContent>
    </Popover>
  );
}
