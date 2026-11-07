"use client";

import { useEffect, useId, useState } from "react";

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

import {
  AutocompleteFieldV2Props,
  AutocompleteOption,
} from "../types/all-fields";

const AutocompleteFieldV2 = <T extends { value: any; label: string }>({
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
  color,
  serverSearch,
  loading = false,
  getOptionsError,
  oneTimeFetch,
  multiple = false,
  ...buttonProps
}: AutocompleteFieldV2Props<T>) => {
  const id = useId();
  const t = useTranslations("autocomplete");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (oneTimeFetch && open) {
      oneTimeFetch();
    }
  }, [oneTimeFetch, open]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        if (multiple && !Array.isArray(field.value)) field.value = [];
        if (!multiple && Array.isArray(field.value)) field.value = undefined;
        // if (field.value && !optionsDefaults.length && oneTimeFetch)
        //   oneTimeFetch();
        // if (field.value && optionsDefaults.length)
        //   field.onChange(
        //     optionsDefaults.find((op) => op.value == field.value?.value) ||
        //       field.value
        //   );
        return (
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
                    "flex h-fit w-full justify-between",
                    {
                      "rounded-none border-0 border-b border-primary px-0 hover:bg-transparent focus:border-b-primary focus-visible:ring-0":
                        variant === "under_line",
                    },
                    color && `text-[${color}] hover:text-[${color}]`,
                    buttonClassName
                  )}
                  {...buttonProps}
                >
                  {(Array.isArray(field.value) && field.value.length ? (
                    <div className="flex flex-wrap gap-2">
                      {field.value.map((option) => {
                        return (
                          <div
                            key={option.value}
                            className="flex items-center gap-3 rounded bg-primary px-2 py-1 text-background"
                          >
                            {option?.label}
                            <span
                              className="ml-1 cursor-pointer"
                              role="button"
                              tabIndex={0}
                              onClick={(e) => {
                                e.stopPropagation();
                                const newSelectedValues = field.value.filter(
                                  (v: AutocompleteOption) =>
                                    v.value !== option.value
                                );
                                field.onChange(newSelectedValues);
                                if (onChange) onChange(newSelectedValues);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const newSelectedValues = field.value.filter(
                                    (v: AutocompleteOption) =>
                                      v.value !== option.value
                                  );
                                  field.onChange(newSelectedValues);
                                  if (onChange) onChange(newSelectedValues);
                                }
                              }}
                            >
                              <X />
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    field.value?.label
                  )) || t("Select option")}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command shouldFilter={!serverSearch}>
                  <CommandInput
                    onValueChange={(e) => {
                      serverSearch?.(e);
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
                        optionsDefaults?.map((option) => {
                          const isSelected = Array.isArray(field.value)
                            ? field.value.some(
                                (v: AutocompleteOption) =>
                                  v.value === option.value
                              )
                            : field.value?.value === option.value;
                          return (
                            <CommandItem
                              key={option.key || option.value}
                              value={`${option.value}:${option.label}`}
                              keywords={option.filterKeys?.filter(Boolean)}
                              onSelect={(currentValue) => {
                                if (multiple) {
                                  const newSelectedValues = isSelected
                                    ? field.value.filter(
                                        (value: AutocompleteOption) =>
                                          value.value !== option.value
                                      )
                                    : [...field.value, option];
                                  field.onChange(newSelectedValues);
                                  if (onChange) onChange(newSelectedValues);
                                } else {
                                  const [selectedValue] =
                                    currentValue.split(":");
                                  const value =
                                    selectedValue ===
                                    field.value?.value?.toString()
                                      ? undefined
                                      : option;
                                  field.onChange(value);
                                  if (onChange) onChange(option);
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
                {/* @ts-expect-error - error.value is not defined */}
                {error.message || error.value?.message}
              </span>
            )}
          </div>
        );
      }}
    />
  );
};

export default AutocompleteFieldV2;
