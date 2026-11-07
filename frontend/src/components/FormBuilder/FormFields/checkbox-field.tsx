"use client";

import { useId } from "react";

import { Controller } from "react-hook-form";
import { Checkbox } from "src/components/FormBuilder/ui/checkbox";
import { cn } from "src/lib/utils";

import { CheckboxFieldProps } from "../types/all-fields";

const CheckboxField = <T,>({
  name,
  control,
  label,
  required = false,
  containerClassName,
  errorClassName,
  labelClassName,
  onChange,
  ...checkboxProps
}: CheckboxFieldProps<T>) => {
  const id = useId();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div
          className={cn(
            "items-top col-span-12 flex w-full gap-2 space-x-2",
            containerClassName
          )}
        >
          <Checkbox
            id={id}
            checked={field.value}
            onCheckedChange={(checked) => {
              field.onChange(checked);
              if (onChange) onChange(!!checked);
            }}
            {...checkboxProps}
          />
          <div className="grid gap-1.5 leading-none">
            {label && (
              <label
                htmlFor={id}
                className={cn(
                  "-mt-1 cursor-pointer text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                  labelClassName
                )}
              >
                {label}
                {required && <span className="ml-1 text-red-500">{"*"}</span>}
              </label>
            )}
            {error && (
              <span className={cn("text-sm text-red-500", errorClassName)}>
                {error.message}
              </span>
            )}
          </div>
        </div>
      )}
    />
  );
};

export default CheckboxField;
