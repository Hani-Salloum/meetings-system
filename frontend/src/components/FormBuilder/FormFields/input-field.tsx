"use client";

import { useId } from "react";

import { Controller } from "react-hook-form";
import { cn } from "src/lib/utils";

import { Input } from "@/components/ui/input";

import { InputFieldProps } from "../types/all-fields";

type InputVariant =
  | "default"
  | "outline"
  | "ghost"
  | "transparent"
  | "under_line";
type InputSize = "sm" | "md" | "lg";

const variantStyles: Record<InputVariant, string> = {
  default:
    "border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-1  focus:ring-primary/10",
  outline:
    "border-[1px] border-gray-300 bg-transparent hover:border-primary focus:ring-primary focus:ring-2 focus:border-primary/10 transition-all duration-300 ease-out ",
  ghost:
    "border-none bg-gray-50 hover:bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500/10 shadow-sm hover:shadow-md transition-all duration-300 ease-out",
  transparent:
    "border-none bg-transparent hover:bg-primary focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all duration-300 ease-out",
  under_line: "rounded-none border-b-[1px] border-primary bg-transparent  ",
};

const sizeStyles: Record<InputSize, string> = {
  sm: "px-2 py-1 text-sm",
  md: "px-3 py-2 text-base",
  lg: "px-4 py-3 text-lg",
};

const InputField = <T,>({
  name,
  control,
  label,
  required = false,
  type = "text",
  containerClassName,
  inputClassName,
  labelClassName,
  errorClassName,
  onChange,
  variant = "default",
  size = "md",
  hidden = false,
  disabled = false,
  inputProps = {},
  prefix,
  suffix,
  placeholder,
  color,
  rows = 4,
}: InputFieldProps<T> & { rows?: number }) => {
  const id = useId();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div
          className={cn(
            "col-span-12 p-2",
            { "cursor-not-allowed opacity-50": disabled },
            { hidden: hidden },
            containerClassName
          )}
        >
          <label
            htmlFor={id}
            className={cn(
              "mb-1 block text-base font-medium text-muted-foreground",
              color && `text-[${color}]`,
              labelClassName
            )}
          >
            {label || name}
            {required && <span className="ml-1 text-red-500">{"*"}</span>}
          </label>

          <div className="relative flex items-center">
            {prefix && (
              <div className="absolute z-10 flex items-center ltr:left-3 rtl:right-3">
                {prefix}
              </div>
            )}

            {type === "textarea" ? (
              <textarea
                id={id}
                className={cn(
                  "w-full resize-none rounded-md transition-colors",
                  sizeStyles[size],
                  "focus:outline-none",
                  color && `text-[${color}] hover:text-[${color}]`,
                  {
                    "border-red-500 focus:ring-red-500": !!error,
                    "ltr:pl-10 rtl:pr-10": !!prefix,
                    "ltr:pr-10 rtl:pl-10": !!suffix,
                  },
                  variantStyles[variant],
                  inputClassName
                )}
                placeholder={placeholder}
                {...field}
                onChange={(e) => {
                  if (onChange) {
                    onChange(e.target.value);
                  } else {
                    field.onChange(e);
                  }
                }}
                value={field.value || ""}
                disabled={disabled}
                rows={rows}
                {...inputProps}
              />
            ) : type === "color" ? (
              <input
                id={id}
                type="color"
                className={cn(
                  "min-h-10 w-full cursor-pointer appearance-none rounded-md py-1",
                  "focus:outline-none",
                  color && `text-[${color}] hover:text-[${color}]`,
                  {
                    "border-red-500 focus:ring-red-500": !!error,
                    "ltr:pl-10 rtl:pr-10": !!prefix,
                    "ltr:pr-10 rtl:pl-10": !!suffix,
                  },
                  variantStyles[variant],
                  inputClassName
                )}
                {...field}
                onChange={(e) => {
                  if (onChange) {
                    onChange(e.target.value);
                  } else {
                    field.onChange(e);
                  }
                }}
                value={field.value || "#000000"}
                disabled={disabled}
                {...inputProps}
              />
            ) : (
              <Input
                id={id}
                type={type}
                className={cn(
                  sizeStyles[size],
                  {
                    "border-red-500 focus:ring-red-500": !!error,
                    "ltr:pl-10 rtl:pr-10": !!prefix,
                    "ltr:pr-10 rtl:pl-10": !!suffix,
                  },
                  variantStyles[variant],
                  inputClassName
                )}
                placeholder={placeholder}
                {...field}
                onChange={(e) => {
                  if (onChange) {
                    onChange(e.target.value);
                  } else {
                    field.onChange(e);
                  }
                }}
                value={field.value || ""}
                disabled={disabled}
                {...inputProps}
              />
            )}
            {suffix && (
              <div className="absolute z-10 flex items-center ltr:right-3 rtl:left-3 rtl:right-auto">
                {suffix}
              </div>
            )}
          </div>
          {error && (
            <span
              className={cn("-bottom-6 text-sm text-red-500", errorClassName)}
            >
              {error.message}
            </span>
          )}
        </div>
      )}
    />
  );
};

export default InputField;
