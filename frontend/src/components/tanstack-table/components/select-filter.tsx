"use client";

import * as React from "react";

import Fuse from "fuse.js";
import { ChevronsUpDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Virtuoso } from "react-virtuoso";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";

interface SelectFilterProps {
  filter: any;
  filterField: any;
  inputId: string;
  updateFilter: (params: { rowId: string; field: any }) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const SelectFilter = React.memo<SelectFilterProps>(
  ({
    filter,
    filterField,
    inputId,
    updateFilter,
    searchQuery,
    onSearchChange,
  }) => {
    const t = useTranslations();

    const [isOpen, setIsOpen] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const fuse = React.useMemo(() => {
      if (!filterField?.options) return null;

      return new Fuse(filterField.options, {
        keys: ["keywords", "label", "value"],
        threshold: 0.4,
        minMatchCharLength: 1,
        includeScore: true,
      });
    }, [filterField?.options]);

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

    const selectedOption = React.useMemo(() => {
      return filterField?.options?.find(
        (option: any) => option.value === filter.value
      );
    }, [filterField?.options, filter.value]);

    const currentValue = React.useMemo(() => {
      return filter?.value?.value || filter?.value || "";
    }, [filter?.value]);

    const placeholderText = React.useMemo(() => {
      return filterField.placeholder ?? t("Select option");
    }, [filterField.placeholder, t]);

    const searchPlaceholder = React.useMemo(() => {
      return filterField?.label ?? "Search options...";
    }, [filterField?.label]);

    const ariaLabel = React.useMemo(() => {
      return `${filterField.label} filter value`;
    }, [filterField.label]);

    const searchAriaLabel = React.useMemo(() => {
      return `Search ${filterField?.label} options`;
    }, [filterField?.label]);

    const handleValueChange = React.useCallback(
      (value: string) => {
        updateFilter({ rowId: filter.rowId, field: { value } });
        setTimeout(() => {
          document.getElementById(inputId)?.click();
        }, 0);
      },
      [updateFilter, filter.rowId, inputId]
    );

    const handleSearchChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(e.target.value);
      },
      [onSearchChange]
    );

    const handleOpenChange = React.useCallback((open: boolean) => {
      setIsOpen(open);
    }, []);

    React.useEffect(() => {
      if (isOpen) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
    }, [isOpen]);

    React.useEffect(() => {
      if (!isOpen) {
        onSearchChange("");
      }
    }, [isOpen]);

    const triggerContent = React.useMemo(() => {
      if (filter.value && typeof filter.value === "string") {
        return (
          <Badge variant="default" className="rounded-sm px-1 font-normal">
            {selectedOption?.label || filter.value}
          </Badge>
        );
      }

      return (
        <>
          {placeholderText}
          <ChevronsUpDown className="size-4" aria-hidden="true" />
        </>
      );
    }, [filter.value, selectedOption?.label, placeholderText]);

    const renderItem = React.useCallback(
      (index: number) => {
        const option = filteredOptions[index];
        if (!option) return null;

        return (
          <SelectItem
            key={option.value}
            value={option?.value}
            className="flex items-center justify-between hover:bg-gray-500 focus:bg-gray-500"
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
          </SelectItem>
        );
      },
      [filteredOptions]
    );

    return (
      <Select
        open={isOpen}
        onOpenChange={handleOpenChange}
        value={currentValue}
        onValueChange={handleValueChange}
      >
        <SelectTrigger
          id={inputId}
          className="h-8 w-full justify-start gap-2 rounded px-1.5 text-left text-muted-foreground hover:text-gray-700"
          aria-label={ariaLabel}
          aria-controls={`${inputId}-listbox`}
        >
          <SelectValue placeholder={placeholderText}>
            {triggerContent}
          </SelectValue>
        </SelectTrigger>
        <SelectContent
          id={`${inputId}-listbox`}
          className="max-h-[250px] w-[12.5rem]"
        >
          <div className="sticky top-0 z-10 bg-background p-1">
            <Input
              placeholder={searchPlaceholder}
              aria-label={searchAriaLabel}
              value={searchQuery}
              onChange={handleSearchChange}
              autoFocus
              ref={inputRef}
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
            <div className="py-2 text-center text-xs text-muted-foreground">
              {t("autocomplete.NoResults")}
            </div>
          )}
        </SelectContent>
      </Select>
    );
  },
  // Custom comparison function for React.memo
  (prevProps, nextProps) => {
    // Only re-render if these specific props change
    return (
      prevProps.filter.rowId === nextProps.filter.rowId &&
      prevProps.filter.value === nextProps.filter.value &&
      prevProps.filterField.id === nextProps.filterField.id &&
      prevProps.inputId === nextProps.inputId &&
      prevProps.searchQuery === nextProps.searchQuery &&
      prevProps.filterField.options === nextProps.filterField.options &&
      prevProps.filterField.label === nextProps.filterField.label &&
      prevProps.filterField.placeholder === nextProps.filterField.placeholder
    );
  }
);

SelectFilter.displayName = "SelectFilter";

export default SelectFilter;
