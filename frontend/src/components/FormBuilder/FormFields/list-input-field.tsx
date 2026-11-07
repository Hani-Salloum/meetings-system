"use client";

import { useId, useState } from "react";
import { Controller } from "react-hook-form";
import { cn } from "src/lib/utils";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListInputFieldProps } from "../types/all-fields";

const ListInputField = <T,>({
  name,
  control,
  label,
  required = false,
  placeholder = "Enter value...",
  containerClassName,
  errorClassName,
  labelClassName,
  buttonText = "Add",
  maxItems,
  onChange,
}: ListInputFieldProps<T>) => {
  const id = useId();
  const [inputValue, setInputValue] = useState("");

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const items: string[] = field.value || [];

        const handleAdd = () => {
          const trimmedValue = inputValue.trim();

          if (!trimmedValue) return;

          // Prevent duplicates
          if (items.includes(trimmedValue)) {
            setInputValue("");
            return;
          }

          // Check max items
          if (maxItems && items.length >= maxItems) {
            return;
          }

          const newItems = [...items, trimmedValue];
          field.onChange(newItems);
          if (onChange) onChange(newItems);
          setInputValue("");
        };

        const handleRemove = (index: number) => {
          const newItems = items.filter((_, i) => i !== index);
          field.onChange(newItems);
          if (onChange) onChange(newItems);
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleAdd();
          }
        };

        return (
          <div className={cn("col-span-12 p-2", containerClassName)}>
            {label && (
              <label
                htmlFor={id}
                className={cn(
                  "mb-1 block text-base font-medium text-muted-foreground",
                  labelClassName
                )}
              >
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
              </label>
            )}

            {/* Input with Add Button */}
            <div className="flex gap-2">
              <Input
                id={id}
                type="text"
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={maxItems ? items.length >= maxItems : false}
                className={cn("flex-1", {
                  "border-red-500 focus:ring-red-500": !!error,
                })}
              />
              <Button
                type="button"
                onClick={handleAdd}
                disabled={!inputValue.trim() || (maxItems ? items.length >= maxItems : false)}
                className="px-6"
              >
                {buttonText}
              </Button>
            </div>

            {/* Max items info */}
            {maxItems && (
              <p className="mt-1 text-xs text-muted-foreground">
                {items.length} / {maxItems} items
              </p>
            )}

            {/* List of Items */}
            {items.length > 0 && (
              <div className="mt-3 space-y-2">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3"
                  >
                    <span className="text-sm text-black">{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Remove"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <span className={cn("text-sm text-red-500 mt-1 block", errorClassName)}>
                {error.message}
              </span>
            )}
          </div>
        );
      }}
    />
  );
};

export default ListInputField;