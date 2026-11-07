"use client";

import * as React from "react";

import Fuse from "fuse.js";
import { ChevronsUpDown } from "lucide-react";
import { Virtuoso } from "react-virtuoso";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FacetedFilter,
  FacetedFilterContent,
  FacetedFilterItem,
  FacetedFilterTrigger,
} from "@/components/ui/faceted-filter";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

interface MultiSelectFilterProps {
  filter: any;
  filterField: any;
  inputId: string;
  updateFilter: (params: { rowId: string; field: any }) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  t: (key: string) => string;
}

const MultiSelectFilter = React.memo<MultiSelectFilterProps>(
  ({
    filter,
    filterField,
    inputId,
    updateFilter,
    searchQuery,
    onSearchChange,
    t,
  }) => {
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    // Memoize selected values to prevent recalculation
    const selectedValues = React.useMemo(() => {
      return new Set(Array.isArray(filter.value) ? filter.value : []);
    }, [filter.value]);

    // Memoize the Fuse instance to prevent recreation on every render
    const fuse = React.useMemo(() => {
      if (!filterField?.options) return null;

      return new Fuse(filterField.options, {
        keys: ["keywords", "label", "value"],
        threshold: 0.4,
        minMatchCharLength: 1,
        includeScore: true,
      });
    }, [filterField?.options]);

    // Memoize filtered options to prevent recalculation on every render
    const filteredOptions = React.useMemo(() => {
      if (!filterField?.options) return [];

      if (!debouncedSearchQuery.trim() || !fuse) {
        return filterField.options.slice(0, 50);
      }

      try {
        return fuse.search(debouncedSearchQuery).map((result) => result.item);
      } catch (error) {
        console.error("Fuse search error:", error);
        return filterField.options.slice(0, 50);
      }
    }, [debouncedSearchQuery, fuse, filterField?.options]);

    // Memoize the placeholder text
    const placeholderText = React.useMemo(() => {
      return filterField.placeholder ?? t("Select options");
    }, [filterField.placeholder]);

    // Memoize the search placeholder
    const searchPlaceholder = React.useMemo(() => {
      return filterField?.label ?? t("Search options");
    }, [filterField?.label]);

    // Memoize the aria label
    const ariaLabel = React.useMemo(() => {
      return `${filterField.label} filter values`;
    }, [filterField.label]);

    // Memoize the search aria label
    const searchAriaLabel = React.useMemo(() => {
      return `Search ${filterField?.label} options`;
    }, [filterField?.label]);

    // Memoize the title for the button
    const buttonTitle = React.useMemo(() => {
      if (selectedValues.size > 0) {
        return Array.from(selectedValues)
          .map(
            (value) =>
              filterField?.options?.find(
                (option: any) => option.value === value
              )?.label || value
          )
          .join(", ");
      }
      return placeholderText;
    }, [selectedValues, filterField?.options, placeholderText]);

    // Memoize the search change handler
    const handleSearchChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(e.target.value);
      },
      [onSearchChange]
    );

    // Memoize the select handler
    const handleSelect = React.useCallback(
      (value: any) => {
        const currentValue = Array.isArray(filter.value) ? filter.value : [];
        const newValue = currentValue.includes(value)
          ? currentValue.filter((v: any) => v !== value)
          : [...currentValue, value];
        updateFilter({
          rowId: filter.rowId,
          field: { value: newValue },
        });
      },
      [filter.value, filter.rowId, updateFilter]
    );

    // Memoize the render item function
    const renderItem = React.useCallback(
      (index: number) => {
        const option = filteredOptions[index];
        if (!option) return null;

        return (
          <FacetedFilterItem
            key={option.value}
            value={option.value}
            selected={selectedValues.has(option.value)}
            onSelect={handleSelect}
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
        );
      },
      [filteredOptions, selectedValues, handleSelect]
    );

    // Memoize the trigger content
    const triggerContent = React.useMemo(() => {
      if (selectedValues.size === 0) {
        return (
          <>
            {placeholderText}
            <ChevronsUpDown className="size-4" aria-hidden="true" />
          </>
        );
      }

      return (
        <div className="flex items-center">
          <Badge
            variant="default"
            className="rounded-sm px-1 font-normal lg:hidden"
          >
            {selectedValues.size}
          </Badge>
          <div className="hidden min-w-0 gap-1 lg:flex">
            {selectedValues.size > 2 ? (
              <Badge variant="default" className="rounded-sm px-1 font-normal">
                {selectedValues.size} {t("selected")}
              </Badge>
            ) : (
              filterField?.options
                ?.filter((option: any) => selectedValues.has(option.value))
                .map((option: any) => (
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
      );
    }, [selectedValues, placeholderText, filterField?.options, t]);

    return (
      <FacetedFilter>
        <FacetedFilterTrigger asChild>
          <Button
            id={inputId}
            variant="outline"
            size="sm"
            aria-label={ariaLabel}
            aria-controls={`${inputId}-listbox`}
            className="h-8 w-full justify-start gap-2 rounded px-1.5 text-left"
            title={buttonTitle}
          >
            {triggerContent}
          </Button>
        </FacetedFilterTrigger>
        <FacetedFilterContent
          id={`${inputId}-listbox`}
          className="w-[12.5rem] origin-[var(--radix-popover-content-transform-origin)]"
        >
          <div className="sticky top-0 z-10 bg-background p-1">
            <Input
              aria-label={searchAriaLabel}
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={handleSearchChange}
              autoFocus
              className="w-full text-xs"
            />
          </div>
          {filteredOptions.length > 0 ? (
            <Virtuoso
              style={{
                height: Math.min(filteredOptions.length * 40, 200),
              }}
              totalCount={filteredOptions.length}
              itemContent={renderItem}
              overscan={10}
            />
          ) : (
            <div className="py-2 text-center text-xs">
              {t("No options found")}
            </div>
          )}
        </FacetedFilterContent>
      </FacetedFilter>
    );
  },
  // Custom comparison function for React.memo
  (prevProps, nextProps) => {
    // Only re-render if these specific props change
    return (
      prevProps.filter.rowId === nextProps.filter.rowId &&
      JSON.stringify(prevProps.filter.value) ===
        JSON.stringify(nextProps.filter.value) &&
      prevProps.filterField.id === nextProps.filterField.id &&
      prevProps.inputId === nextProps.inputId &&
      prevProps.searchQuery === nextProps.searchQuery &&
      prevProps.filterField.options === nextProps.filterField.options &&
      prevProps.filterField.label === nextProps.filterField.label &&
      prevProps.filterField.placeholder === nextProps.filterField.placeholder
    );
  }
);

MultiSelectFilter.displayName = "MultiSelectFilter";

export default MultiSelectFilter;
