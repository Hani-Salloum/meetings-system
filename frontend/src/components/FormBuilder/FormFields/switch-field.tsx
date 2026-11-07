"use client";

import { useId } from "react";

import { Controller } from "react-hook-form";
import { cn } from "src/lib/utils";

import { Switch } from "@/components/ui/switch";
import { useLocale } from "next-intl";

import { SwitchFieldProps } from "../types/all-fields";

const SwitchField = <T,>({
  name,
  control,
  label,
  required = false,
  containerClassName,
  errorClassName,
  labelClassName,
  onChange,
  ...checkboxProps
}: SwitchFieldProps<T>) => {
  const id = useId();
  const locale = useLocale();

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
          <Switch
            locale={locale as "en" | "ar"}
            id={id}
            checked={field.value}
            onCheckedChange={(checked) => {
              console.log(checked);
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

export default SwitchField;
