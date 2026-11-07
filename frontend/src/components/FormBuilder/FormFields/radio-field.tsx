"use client";

import { useId } from "react";

import { useLocale } from "next-intl";
import { Controller } from "react-hook-form";
import { Label } from "src/components/FormBuilder/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "src/components/FormBuilder/ui/radio-group";
import { cn } from "src/lib/utils";

import { RadioFieldProps } from "../types/all-fields";

const RadioField = <T,>({
  name,
  label,
  control,
  options,
  required = false,
  containerClassName,
  OptionsClassName,
  OptionsLabelClassName,
  labelClassName,
  RadioGroupClassName,
  errorClassName,
  onChange,
  ...radioProps
}: RadioFieldProps<T>) => {
  const id = useId();
  const locale = useLocale();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={cn("col-span-12", containerClassName)}>
          <label
            className={cn("text-base font-medium leading-6", labelClassName)}
          >
            {label}
            {required && <span className="ml-1 text-red-500">{"*"}</span>}
          </label>

          <RadioGroup
            dir={locale === "ar" ? "rtl" : "ltr"}
            onValueChange={(value: any) => {
              field.onChange(value);
              if (onChange) onChange(value);
            }}
            defaultValue={field.value}
            className={cn("flex", RadioGroupClassName)}
            {...radioProps}
          >
            {options.map((option) => (
              <div
                key={option.value}
                className={cn(
                  "flex items-center justify-center",
                  OptionsClassName
                )}
              >
                <RadioGroupItem
                  className="mx-1 bg-white"
                  value={option.value}
                  id={`${id}-${option.value}`}
                />
                <Label
                  className={`${OptionsLabelClassName} text-base`}
                  htmlFor={`${id}-${option.value}`}
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>

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

export default RadioField;
