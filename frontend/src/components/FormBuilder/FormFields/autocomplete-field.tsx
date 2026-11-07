"use client";

import { useEffect, useId, useMemo, useState } from "react";

import { Check, ChevronsUpDown, Loader2, RefreshCcw, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { Button } from "src/components/FormBuilder/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "src/components/FormBuilder/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "src/components/FormBuilder/ui/popover";
import { cn } from "src/lib/utils";

import { AutocompleteFieldProps } from "../types/all-fields";
import { useDebounce } from "../utils/use-debounce";

const AutocompleteField = <T extends { value: any; label: string }>({
  name,
  control,
  options: optionsDefaults,
  required = false,
  placeholder,
  label,
  containerClassName,
  labelClassName,
  errorClassName,
  onChange,
  variant = "outline",
  size = "default",
  hidden = false,
  buttonClassName,
  multiple = false,
  color,
  serverSearch,
  loading = false,
  getOptionsError,
  oneTimeFetch,
  ...buttonProps
}: AutocompleteFieldProps<T>) => {
  const id = useId();
  const t = useTranslations();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const options = useMemo(() => {
    if (debouncedSearch === "") return optionsDefaults;
    return optionsDefaults.filter((option) => {
      if (option.filterKeys) {
        return option.filterKeys
          .join(" ")
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase());
      } else
        return option.label
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase());
    });
  }, [debouncedSearch, optionsDefaults]);
  const [selectedValues, setSelectedValues] = useState<T["value"][]>([]);

  useEffect(() => {
    if (oneTimeFetch && open) {
      oneTimeFetch();
    }
  }, [oneTimeFetch, open]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div
          className={cn(
            "col-span-12 p-2",
            { hidden: hidden },
            containerClassName
          )}
        >
          <label
            htmlFor={id}
            className={cn(
              "mb-3 block text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              labelClassName
            )}
          >
            {label}
            {required && <span className="ml-1 text-red-500">{"*"}</span>}
          </label>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={
                  variant === "under_line" || variant === "transparent"
                    ? "ghost"
                    : variant
                }
                size={size}
                role="combobox"
                aria-expanded={open}
                className={cn(
                  "flex w-full justify-between",
                  {
                    "rounded-none border-0 border-b border-primary-foreground px-0 hover:bg-transparent focus:border-b-primary-foreground focus-visible:ring-0":
                      variant === "under_line",
                  },
                  color && `text-[${color}] hover:text-[${color}]`,
                  buttonClassName
                )}
                {...buttonProps}
              >
                {multiple ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedValues.length > 0 ? (
                      selectedValues.map((value) => {
                        const option = optionsDefaults?.find(
                          (option) => option.value === value
                        );
                        return (
                          <div
                            key={value}
                            className="flex items-center gap-3 rounded bg-primary px-2 py-1 "
                          >
                            {option?.label}
                            <span
                              className="ml-1 cursor-pointer"
                              role="button"
                              tabIndex={0}
                              onClick={(e) => {
                                e.stopPropagation();
                                const newSelectedValues = selectedValues.filter(
                                  (v) => v !== value
                                );
                                setSelectedValues(newSelectedValues);
                                field.onChange(
                                  newSelectedValues as T["value"][]
                                );
                                if (onChange)
                                  onChange(newSelectedValues.join(", "));
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const newSelectedValues =
                                    selectedValues.filter((v) => v !== value);
                                  setSelectedValues(newSelectedValues);
                                  field.onChange(
                                    newSelectedValues as T["value"][]
                                  );
                                  if (onChange)
                                    onChange(newSelectedValues.join(", "));
                                }
                              }}
                            >
                              <X />
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <span className="text-gray-500 ">
                        {placeholder || t("Select options")}
                      </span>
                    )}
                  </div>
                ) : field.value ? (
                  optionsDefaults?.find(
                    (option) => option.value === field.value
                  )?.label
                ) : (
                  placeholder || t("Select option")
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              {/* // todo : connect filter correctly using cmdk built in filter */}
              <Command shouldFilter={false}>
                <CommandInput
                  onValueChange={(e) => {
                    serverSearch?.(e);
                    setSearch(e.toLowerCase());
                  }}
                  placeholder={placeholder || t("Search options")}
                  ButtonAfter={
                    oneTimeFetch && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          oneTimeFetch(true);
                        }}
                      >
                        <RefreshCcw className="h-2 w-2" />
                      </Button>
                    )
                  }
                />
                <CommandList>
                  <CommandEmpty>{t("NoResults")}</CommandEmpty>
                  <CommandGroup>
                    {loading && (
                      <CommandItem className="flex items-center justify-center">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </CommandItem>
                    )}
                    {!loading && getOptionsError && (
                      <CommandItem>
                        {/* show there was error fetching message with retry button */}
                        <p>{t("Error fetching options")}</p>
                        <Button
                          variant="outline"
                          onClick={() => {
                            serverSearch?.(field.value);
                            oneTimeFetch?.(true);
                          }}
                        >
                          {t("Retry")}
                        </Button>
                      </CommandItem>
                    )}
                    {!(loading || getOptionsError) &&
                      options.map((option) => {
                        const isSelected = multiple
                          ? selectedValues.includes(option.value)
                          : field.value === option.value;
                        return (
                          <CommandItem
                            key={option.key || option.value}
                            value={option.value}
                            keywords={option.filterKeys?.filter(Boolean)}
                            onSelect={(currentValue) => {
                              if (multiple) {
                                const newSelectedValues = isSelected
                                  ? selectedValues.filter(
                                      (value) => value !== currentValue
                                    )
                                  : [...selectedValues, currentValue];
                                setSelectedValues(newSelectedValues);
                                field.onChange(
                                  newSelectedValues as T["value"][]
                                );
                                if (onChange)
                                  onChange(newSelectedValues.join(", "));
                              } else {
                                const value =
                                  currentValue === field.value
                                    ? ("" as unknown as T["value"])
                                    : currentValue;
                                field.onChange(value);
                                if (onChange) onChange(value);
                                setOpen(false);
                              }
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                isSelected ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {option.icon && <option.icon />}
                            {option.label}
                          </CommandItem>
                        );
                      })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {error && (
            <span className={cn("text-sm text-red-500", errorClassName)}>
              {error.message}
            </span>
          )}
        </div>
      )}
    />
  );
};

export default AutocompleteField;
