"use client";

import { useId } from "react";

import { Controller } from "react-hook-form";
import { cn } from "src/lib/utils";

import { Slider } from "@/components/ui/slider";

import { SliderFieldProps } from "../types/all-fields";

/* eslint-disable react/jsx-no-literals */

const SliderField = <T,>({
  name,
  control,
  label,
  required = false,
  containerClassName,
  labelClassName,
  errorClassName,
  onChange,
  defaultValue = [25, 75],
  max = 100,
  step = 1,
  hidden = false,
  className,
  ...sliderProps
}: SliderFieldProps<T>) => {
  const id = useId();

  console.log(defaultValue);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div
          className={cn(
            "col-span-12 h-full w-full space-y-9",
            { hidden: hidden },
            containerClassName
          )}
        >
          <label
            htmlFor={id}
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              "flex max-w-[90%] items-center justify-between gap-8",
              labelClassName
            )}
          >
            {label || name}
            <p dir="ltr" className="rounded-lg bg-primary px-2 py-1">
              {field.value ? field.value?.join(" - ") : "25 - 75"}
            </p>
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
          <Slider
            id={id}
            defaultValue={[25, 75]}
            max={max}
            step={step}
            className={cn("w-[90%]", className)}
            onValueChange={(value: any) => {
              field.onChange(value);
              if (onChange) onChange(value);
            }}
            {...sliderProps}
          />

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

export default SliderField;
