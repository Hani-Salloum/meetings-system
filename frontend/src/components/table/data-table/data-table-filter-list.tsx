"use client";

/* eslint-disable max-lines */
import * as React from "react";

import { type Table } from "@tanstack/react-table";
import Cookies from "js-cookie";
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  GripVertical,
  ListFilter,
  Trash2,
} from "lucide-react";
import { customAlphabet } from "nanoid";
import { useTranslations } from "next-intl";
import { parseAsStringEnum, useQueryState } from "nuqs";

import { dataTableConfig } from "@/components/table/configs/data-table";
import {
  getDefaultFilterOperator,
  getFilterOperators,
} from "@/components/table/lib/data-table";
import { getFiltersStateParser } from "@/components/table/lib/parsers";
import { formatDate } from "@/components/table/lib/utils-table";
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
import {
  FacetedFilter,
  FacetedFilterContent,
  FacetedFilterEmpty,
  FacetedFilterGroup,
  FacetedFilterInput,
  FacetedFilterItem,
  FacetedFilterList,
  FacetedFilterTrigger,
} from "@/components/ui/faceted-filter";
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
import {
  Sortable,
  SortableDragHandle,
  SortableItem,
} from "@/components/ui/sortable";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { cn } from "@/lib/utils";

import type {
  DataTableAdvancedFilterField,
  Filter,
  FilterOperator,
  JoinOperator,
  NestedKeyOf,
} from "../types/table";

interface DataTableFilterListProps<TData> {
  table: Table<TData>;
  filterFields: DataTableAdvancedFilterField<TData>[];
  debounceMs: number;
  shallow?: boolean;
}

export function DataTableFilterList<TData>({
  table,
  filterFields,
  debounceMs,
  shallow,
}: DataTableFilterListProps<TData>) {
  const id = React.useId();
  const t = useTranslations("TableConfig");

  const [locale] = React.useState<"ar" | "en">(
    (Cookies.get("NEXT_LOCALE") as "ar" | "en") ?? "ar"
  );

  const [filters, setFilters] = useQueryState(
    "filters",
    getFiltersStateParser(table.getRowModel().rows[0]?.original)
      .withDefault([])
      .withOptions({
        clearOnDefault: true,
        shallow,
      })
  );

  const [joinOperator, setJoinOperator] = useQueryState(
    "joinOperator",
    parseAsStringEnum(["and", "or"]).withDefault("and").withOptions({
      clearOnDefault: true,
      shallow,
    })
  );

  const debouncedSetFilters = useDebouncedCallback(setFilters, debounceMs);

  function addFilter() {
    const filterField = filterFields[0];

    if (!filterField) return;

    void setFilters([
      ...filters,
      {
        id: filterField.id as NestedKeyOf<TData>,
        value: "",
        type: filterField.type,
        operator: getDefaultFilterOperator(filterField.type),
        rowId: customAlphabet(
          "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
          6
        )(),
        ...(filterField.relationOperator
          ? { relationOperator: filterField.relationOperator }
          : {}),
      },
    ]);
  }

  function updateFilter({
    rowId,
    field,
    debounced = false,
  }: {
    rowId: string;
    field: Omit<Partial<Filter<TData>>, "rowId">;
    debounced?: boolean;
  }) {
    const filterField = filterFields.find((f) => f.id === field.id);

    const updateFunction = debounced ? debouncedSetFilters : setFilters;
    updateFunction((prevFilters) => {
      const updatedFilters = prevFilters.map((filter) => {
        if (filter.rowId === rowId) {
          return {
            ...filter,
            ...field,
            ...(filterField?.relationOperator
              ? { relationOperator: filterField.relationOperator }
              : {}),
          };
        }
        return filter;
      });
      return updatedFilters;
    });
  }

  function removeFilter(rowId: string) {
    const updatedFilters = filters.filter((filter) => filter.rowId !== rowId);
    void setFilters(updatedFilters);
  }

  function moveFilter(activeIndex: number, overIndex: number) {
    void setFilters((prevFilters) => {
      const newFilters = [...prevFilters];
      const [removed] = newFilters.splice(activeIndex, 1);
      if (!removed) return prevFilters;
      newFilters.splice(overIndex, 0, removed);
      return newFilters;
    });
  }

  function renderFilterInput({
    filter,
    inputId,
  }: {
    filter: Filter<TData>;
    inputId: string;
  }) {
    const filterField = filterFields.find((f) => f.id === filter.id);

    if (!filterField) return null;

    if (filter.operator === "isEmpty" || filter.operator === "isNotEmpty") {
      return (
        <div
          id={inputId}
          role="status"
          aria-live="polite"
          aria-label={`${filterField.label} filter is ${filter.operator === "isEmpty" ? "empty" : "not empty"}`}
          className="h-8 w-full rounded border border-dashed"
        />
      );
    }

    switch (filter.type) {
      case "text":
      case "number":
        return (
          <Input
            id={inputId}
            type={filter.type}
            aria-label={`${filterField.label} filter value`}
            aria-describedby={`${inputId}-description`}
            placeholder={filterField.placeholder ?? t("EnterValue")}
            className="h-8 w-full rounded"
            defaultValue={
              typeof filter.value === "string" ? filter.value : undefined
            }
            onChange={(event) =>
              updateFilter({
                rowId: filter.rowId,
                field: { value: event.target.value },
                debounced: true,
              })
            }
            title={typeof filter.value === "string" ? filter.value : ""}
          />
        );
      case "select":
        return (
          <FacetedFilter>
            <FacetedFilterTrigger asChild>
              <Button
                id={inputId}
                variant="outline"
                size="sm"
                aria-label={`${filterField.label} filter value`}
                aria-controls={`${inputId}-listbox`}
                className="h-8 w-full justify-start gap-2 rounded px-1.5 text-left text-muted-foreground hover:text-muted-foreground"
                title={
                  filter.value && typeof filter.value === "string"
                    ? filterField?.options?.find(
                        (option) => option.value === filter.value
                      )?.label || filter.value
                    : (filterField.placeholder ?? "Select an option...")
                }
              >
                {filter.value && typeof filter.value === "string" ? (
                  <Badge
                    variant="default"
                    className="rounded-sm px-1 font-normal"
                  >
                    {filterField?.options?.find(
                      (option) => option.value === filter.value
                    )?.label || filter.value}
                  </Badge>
                ) : (
                  <>
                    {filterField.placeholder ?? "Select an option..."}
                    <ChevronsUpDown className="size-4" aria-hidden="true" />
                  </>
                )}
              </Button>
            </FacetedFilterTrigger>
            <FacetedFilterContent
              id={`${inputId}-listbox`}
              className="w-[12.5rem] origin-[var(--radix-popover-content-transform-origin)]"
            >
              <FacetedFilterInput
                placeholder={filterField?.label ?? "Search options..."}
                aria-label={`Search ${filterField?.label} options`}
              />
              <FacetedFilterList>
                <FacetedFilterEmpty> {"No0 options found."}</FacetedFilterEmpty>
                <FacetedFilterGroup>
                  {filterField?.options?.map((option) => (
                    <FacetedFilterItem
                      key={option.value}
                      value={option.value}
                      selected={filter.value === option.value}
                      onSelect={(value: any) => {
                        updateFilter({ rowId: filter.rowId, field: { value } });
                        setTimeout(() => {
                          document.getElementById(inputId)?.click();
                        }, 0);
                      }}
                    >
                      {option.icon && (
                        <option.icon
                          className="mr-2 size-4 text-muted-foreground"
                          aria-hidden="true"
                        />
                      )}
                      <span>{option.label}</span>
                      {option.count && (
                        <span className="ml-auto flex size-4 items-center justify-center font-mono text-xs">
                          {option.count}
                        </span>
                      )}
                    </FacetedFilterItem>
                  ))}
                </FacetedFilterGroup>
              </FacetedFilterList>
            </FacetedFilterContent>
          </FacetedFilter>
        );
      case "multi-select":
        const selectedValues = new Set(
          Array.isArray(filter.value) ? filter.value : []
        );

        return (
          <FacetedFilter>
            <FacetedFilterTrigger asChild>
              <Button
                id={inputId}
                variant="outline"
                size="sm"
                aria-label={`${filterField.label} filter values`}
                aria-controls={`${inputId}-listbox`}
                className="h-8 w-full justify-start gap-2 rounded px-1.5 text-left text-muted-foreground hover:text-muted-foreground"
                title={
                  selectedValues.size > 0
                    ? Array.from(selectedValues)
                        .map(
                          (value) =>
                            filterField?.options?.find(
                              (option) => option.value === value
                            )?.label || value
                        )
                        .join(", ")
                    : (filterField.placeholder ?? "Select options...")
                }
              >
                <>
                  {selectedValues.size === 0 && (
                    <>
                      {filterField.placeholder ?? " Select options..."}
                      <ChevronsUpDown className="size-4" aria-hidden="true" />
                    </>
                  )}
                </>
                {selectedValues?.size > 0 && (
                  <div className="flex items-center">
                    <Badge
                      variant="default"
                      className="rounded-sm px-1 font-normal lg:hidden"
                    >
                      {selectedValues.size}
                    </Badge>
                    <div className="hidden min-w-0 gap-1 lg:flex">
                      {selectedValues.size > 2 ? (
                        <Badge
                          variant="default"
                          className="rounded-sm px-1 font-normal"
                        >
                          {selectedValues.size} {t("selected")}
                        </Badge>
                      ) : (
                        filterField?.options
                          ?.filter((option) => selectedValues.has(option.value))
                          .map((option) => (
                            <Badge
                              variant="default"
                              key={option.value}
                              className="truncate rounded-sm px-1 font-normal"
                            >
                              {option.label}
                            </Badge>
                          ))
                      )}
                    </div>
                  </div>
                )}
              </Button>
            </FacetedFilterTrigger>
            <FacetedFilterContent
              id={`${inputId}-listbox`}
              className="w-[12.5rem] origin-[var(--radix-popover-content-transform-origin)]"
            >
              <FacetedFilterInput
                aria-label={`Search ${filterField?.label} options`}
                placeholder={filterField?.label ?? "Search options..."}
              />
              <FacetedFilterList>
                <FacetedFilterEmpty>No options found.</FacetedFilterEmpty>
                <FacetedFilterGroup>
                  {filterField?.options?.map((option) => (
                    <FacetedFilterItem
                      key={option.value}
                      value={option.value}
                      selected={selectedValues.has(option.value)}
                      onSelect={(value: any) => {
                        const currentValue = Array.isArray(filter.value)
                          ? filter.value
                          : [];
                        const newValue = currentValue.includes(value)
                          ? currentValue.filter((v) => v !== value)
                          : [...currentValue, value];
                        updateFilter({
                          rowId: filter.rowId,
                          field: { value: newValue },
                        });
                      }}
                    >
                      {option.icon && (
                        <option.icon
                          className="mr-2 size-4 text-muted-foreground"
                          aria-hidden="true"
                        />
                      )}
                      <span>{option.label}</span>
                      {option.count && (
                        <span className="ml-auto flex size-4 items-center justify-center font-mono text-xs">
                          {option.count}
                        </span>
                      )}
                    </FacetedFilterItem>
                  ))}
                </FacetedFilterGroup>
              </FacetedFilterList>
            </FacetedFilterContent>
          </FacetedFilter>
        );
      case "date":
        const dateValue = Array.isArray(filter.value)
          ? filter.value.filter(Boolean)
          : [filter.value, filter.value].filter(Boolean);

        const displayValue =
          filter.operator === "isBetween" && dateValue.length === 2
            ? `${formatDate(dateValue[0] ?? new Date())} - ${formatDate(
                dateValue[1] ?? new Date()
              )}`
            : dateValue[0]
              ? formatDate(dateValue[0])
              : "Pick a date";

        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id={inputId}
                variant="outline"
                size="sm"
                aria-label={`${filterField.label} date filter`}
                aria-controls={`${inputId}-calendar`}
                className={cn(
                  "h-8 w-full justify-start gap-2 rounded text-left font-normal",
                  !filter.value && "text-muted-foreground"
                )}
                title={displayValue}
              >
                <CalendarIcon
                  className="size-3.5 shrink-0"
                  aria-hidden="true"
                />
                <span className="truncate">{displayValue}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              id={`${inputId}-calendar`}
              align="start"
              className="w-auto p-0"
            >
              {filter.operator === "isBetween" ? (
                <Calendar
                  id={`${inputId}-calendar`}
                  mode="range"
                  aria-label={`Select ${filterField.label} date range`}
                  selected={
                    dateValue.length === 2
                      ? {
                          from: new Date(dateValue[0] ?? ""),
                          to: new Date(dateValue[1] ?? ""),
                        }
                      : {
                          from: new Date(),
                          to: new Date(),
                        }
                  }
                  onSelect={(date) => {
                    updateFilter({
                      rowId: filter.rowId,
                      field: {
                        value: date
                          ? [
                              date.from?.toISOString() ?? "",
                              date.to?.toISOString() ?? "",
                            ]
                          : [],
                      },
                    });
                  }}
                  initialFocus
                  numberOfMonths={1}
                />
              ) : (
                <Calendar
                  id={`${inputId}-calendar`}
                  mode="single"
                  aria-label={`Select ${filterField.label} date`}
                  selected={dateValue[0] ? new Date(dateValue[0]) : undefined}
                  onSelect={(date) => {
                    updateFilter({
                      rowId: filter.rowId,
                      field: { value: date?.toISOString() ?? "" },
                    });

                    setTimeout(() => {
                      document.getElementById(inputId)?.click();
                    }, 0);
                  }}
                  initialFocus
                />
              )}
            </PopoverContent>
          </Popover>
        );
      case "boolean": {
        if (Array.isArray(filter.value)) return null;

        return (
          <Select
            value={filter.value}
            onValueChange={(value) =>
              updateFilter({ rowId: filter.rowId, field: { value } })
            }
          >
            <SelectTrigger
              id={inputId}
              aria-label={`${filterField.label} boolean filter`}
              aria-controls={`${inputId}-listbox`}
              className="h-8 w-full rounded bg-transparent"
              title={filter.value ? "True" : "False"}
            >
              <SelectValue placeholder={filter.value ? "True" : "False"} />
            </SelectTrigger>
            <SelectContent id={`${inputId}-listbox`}>
              <SelectItem value="true">True</SelectItem>
              <SelectItem value="false">False</SelectItem>
            </SelectContent>
          </Select>
        );
      }
      default:
        return null;
    }
  }

  return (
    <Sortable
      value={filters.map((item) => ({ id: item.rowId }))}
      onMove={({ activeIndex, overIndex }: any) => {
        return moveFilter(activeIndex, overIndex);
      }}
      overlay={
        <div className="flex items-center gap-2">
          <div className="h-8 min-w-[4.5rem] rounded-sm bg-primary/10" />
          <div className="h-8 w-32 rounded-sm bg-primary/10" />
          <div className="h-8 w-32 rounded-sm bg-primary/10" />
          <div className="h-8 min-w-36 flex-1 rounded-sm bg-primary/10" />
          <div className="size-8 shrink-0 rounded-sm bg-primary/10" />
          <div className="size-8 shrink-0 rounded-sm bg-primary/10" />
        </div>
      }
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            aria-label="Open filters"
            aria-controls={`${id}-filter-dialog`}
            title={t("Filters")}
          >
            <ListFilter className="size-3" aria-hidden="true" />
            {t("Filters")}
            {filters.length > 0 && (
              <Badge
                variant="outline"
                className="h-[1.14rem] rounded-[0.2rem] px-[0.32rem] font-mono text-[0.65rem] font-normal"
              >
                {filters.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          id={`${id}-filter-dialog`}
          align="start"
          collisionPadding={16}
          className={cn(
            "flex w-[calc(100vw-theme(spacing.12))] min-w-60 origin-[var(--radix-popover-content-transform-origin)] flex-col p-4 sm:w-[36rem]",
            filters.length > 0 ? "gap-3.5" : "gap-2",
            ""
          )}
        >
          {filters.length > 0 ? (
            <h4 className="font-medium leading-none" title={t("Filters")}>
              {t("Filters")}
            </h4>
          ) : (
            <div className="flex flex-col gap-1">
              <h4
                className="font-medium leading-none"
                title={t("NoFiltersApplied")}
              >
                {t("NoFiltersApplied")}
              </h4>
              <p
                className="text-sm text-muted-foreground"
                title={t("AddFiltersToRefineYourResults")}
              >
                {t("AddFiltersToRefineYourResults")}
              </p>
            </div>
          )}
          <div className="flex max-h-40 flex-col gap-2 overflow-y-auto py-0.5 pr-1">
            {filters.map((filter, index) => {
              const filterId = `${id}-filter-${filter.rowId}`;
              const joinOperatorListboxId = `${filterId}-join-operator-listbox`;
              const fieldListboxId = `${filterId}-field-listbox`;
              const fieldTriggerId = `${filterId}-field-trigger`;
              const operatorListboxId = `${filterId}-operator-listbox`;
              const inputId = `${filterId}-input`;

              return (
                <SortableItem key={filter.rowId} value={filter.rowId} asChild>
                  <div className="flex items-center gap-2">
                    <div className="min-w-[4.5rem] text-center">
                      {index === 0 ? (
                        <span
                          className="text-sm text-muted-foreground"
                          title={t("Where")}
                        >
                          {t("Where")}
                        </span>
                      ) : index === 1 ? (
                        <Select
                          value={joinOperator}
                          onValueChange={(value: JoinOperator) =>
                            setJoinOperator(value)
                          }
                        >
                          <SelectTrigger
                            aria-label="Select join operator"
                            aria-controls={joinOperatorListboxId}
                            className="h-8 rounded lowercase"
                            title={joinOperator}
                          >
                            <SelectValue placeholder={joinOperator} />
                          </SelectTrigger>
                          <SelectContent
                            id={joinOperatorListboxId}
                            position="popper"
                            className="min-w-[var(--radix-select-trigger-width)] lowercase"
                          >
                            {dataTableConfig.joinOperators.map((op) => (
                              <SelectItem key={op.value} value={op.value}>
                                {op.label[locale]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span
                          className="text-sm text-muted-foreground"
                          title={joinOperator}
                        >
                          {joinOperator}
                        </span>
                      )}
                    </div>
                    <Popover modal>
                      <PopoverTrigger asChild>
                        <Button
                          id={fieldTriggerId}
                          variant="outline"
                          size="sm"
                          role="combobox"
                          aria-label="Select filter field"
                          aria-controls={fieldListboxId}
                          className="h-8 w-32 justify-between gap-2 rounded focus:outline-none focus:ring-1 focus:ring-ring focus-visible:ring-0"
                          title={
                            filterFields.find((field) => field.id === filter.id)
                              ?.label ?? "Select field"
                          }
                        >
                          <span className="truncate">
                            {filterFields.find(
                              (field) => field.id === filter.id
                            )?.label ?? "Select field"}
                          </span>
                          <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        id={fieldListboxId}
                        align="start"
                        className="w-40 p-0"
                        onCloseAutoFocus={() =>
                          document.getElementById(fieldTriggerId)?.focus({
                            preventScroll: true,
                          })
                        }
                      >
                        <Command>
                          <CommandInput placeholder="Search fields..." />
                          <CommandList>
                            <CommandEmpty>{t("NoFieldsFound")}</CommandEmpty>
                            <CommandGroup>
                              {filterFields.map((field) => (
                                <CommandItem
                                  key={field.id}
                                  value={field.id}
                                  onSelect={(value) => {
                                    const filterField = filterFields.find(
                                      (col) => col.id === value
                                    );

                                    if (!filterField) return;

                                    updateFilter({
                                      rowId: filter.rowId,
                                      field: {
                                        id: value as NestedKeyOf<TData>,
                                        type: filterField.type,
                                        operator: getDefaultFilterOperator(
                                          filterField.type
                                        ),
                                        value: "",
                                      },
                                    });

                                    document
                                      .getElementById(fieldTriggerId)
                                      ?.click();
                                  }}
                                >
                                  <span
                                    className="mr-1.5 truncate"
                                    title={field.label}
                                  >
                                    {field.label}
                                  </span>
                                  <Check
                                    className={cn(
                                      "ml-auto size-4 shrink-0",
                                      field.id === filter.id
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <Select
                      value={filter.operator}
                      onValueChange={(value: FilterOperator) =>
                        updateFilter({
                          rowId: filter.rowId,
                          field: {
                            operator: value,
                            value:
                              value === "isEmpty" || value === "isNotEmpty"
                                ? "value"
                                : filter.value,
                          },
                        })
                      }
                    >
                      <SelectTrigger
                        aria-label="Select filter operator"
                        aria-controls={operatorListboxId}
                        className="h-8 w-32 rounded"
                        title={filter.operator}
                      >
                        <div className="truncate">
                          <SelectValue placeholder={filter.operator} />
                        </div>
                      </SelectTrigger>
                      <SelectContent id={operatorListboxId}>
                        {getFilterOperators(filter.type).map((op) => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label[locale]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="min-w-36 flex-1">
                      {renderFilterInput({ filter, inputId })}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove filter ${index + 1}`}
                      className="size-8 shrink-0 rounded"
                      onClick={() => removeFilter(filter.rowId)}
                      title={`Remove filter ${index + 1}`}
                    >
                      <Trash2 className="size-3.5" aria-hidden="true" />
                    </Button>
                    <SortableDragHandle
                      variant="outline"
                      size="icon"
                      className="size-8 shrink-0 rounded"
                      title="Drag to reorder"
                    >
                      <GripVertical className="size-3.5" aria-hidden="true" />
                    </SortableDragHandle>
                  </div>
                </SortableItem>
              );
            })}
          </div>
          <div className="flex w-full items-center gap-2">
            <Button
              size="sm"
              className="h-[1.85rem] rounded"
              onClick={addFilter}
              title={t("AddFilter")}
            >
              {t("AddFilter")}
            </Button>
            {filters.length > 0 ? (
              <Button
                size="sm"
                variant="outline"
                className="rounded"
                onClick={() => {
                  void setFilters(null);
                  void setJoinOperator("and");
                }}
                title={t("ResetFilters")}
              >
                {t("ResetFilters")}
              </Button>
            ) : null}
          </div>
        </PopoverContent>
      </Popover>
    </Sortable>
  );
}
