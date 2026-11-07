"use client";

import { useId } from "react";

import { Controller } from "react-hook-form";
import { cn } from "src/lib/utils";

import { InputFieldProps } from "../types/all-fields";
import { PhoneInput } from "./phone-input";

interface PhoneNumberInputFieldProps<T>
  extends Omit<InputFieldProps<T>, "type"> {
  defaultCountry?: string;
}

const PhoneNumberInputField = <T,>({
  name,
  control,
  label,
  required = false,
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
  placeholder,
  color,
  defaultCountry = "SA",
}: PhoneNumberInputFieldProps<T>) => {
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
          {label && (
            <label
              htmlFor={id}
              className={cn(
                "mb-1 block text-base font-medium text-gray-700",
                color && `text-[${color}]`,
                labelClassName
              )}
            >
              {label || name}
              {required && <span className="ml-1 text-red-500">{"*"}</span>}
            </label>
          )}
          <PhoneInput
            id={id}
            className={cn(
              "dir-ltr w-full rounded-[8px] border border-input bg-background",
              variantStyles[variant],
              sizeStyles[size],
              { "border-red-500 focus:ring-red-500": !!error },
              inputClassName
            )}
            defaultCountry={defaultCountry}
            value={field.value}
            onChange={(value) => {
              field.onChange(value);
              if (onChange) onChange(value);
            }}
            placeholder={placeholder || "أدخل رقم الهاتف"}
            disabled={disabled}
            {...inputProps}
          />
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

type InputVariant =
  | "default"
  | "outline"
  | "ghost"
  | "transparent"
  | "under_line";
type InputSize = "sm" | "md" | "lg";

// استيراد الأنماط من InputField الأصلي
const variantStyles: Record<InputVariant, string> = {
  default: "hover:bg-accent border border-input bg-background",
  outline: "border-2 border-gray-300 bg-transparent text-black dark:text-white",
  ghost: "border-none bg-gray-100",
  transparent: "border-none bg-transparent",
  under_line: "rounded-none bg-transparent border-b-[1px] border-primary",
};

const sizeStyles: Record<InputSize, string> = {
  sm: "px-2 py-0.5 text-sm",
  md: "px-3 py-0.5 text-base",
  lg: "px-4 py-0.5 text-lg",
};

export default PhoneNumberInputField;

export type { PhoneNumberInputFieldProps };
