"use client";

import { useId, useState } from "react";

import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { Button } from "src/components/FormBuilder/ui/button";
import { Calendar } from "src/components/FormBuilder/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "src/components/FormBuilder/ui/popover";
import { cn } from "src/lib/utils";

import { DateFieldProps } from "../types/all-fields";
import CaptionWithSelectMonthAndYear from "../ui/caption-with-select-month-and-year";

const DateField = <T,>({
  name,
  control,
  required = false,
  placeholder,
  containerClassName,
  buttonClassName,
  labelClassName,
  errorClassName,
  onChange,
  label,
  variant = "outline",
  minDate,
  ...calendarProps
}: DateFieldProps<T> & { minDate?: Date }) => {
  const t = useTranslations();
  const id = useId();
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const disableDatesBeforeMinDate = (date: Date) => {
    return minDate ? date < minDate : false;
  };
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div
          className={cn(
            "col-span-12 w-full p-2",
            containerClassName,
            variant === "under_line" && "w-auto space-y-0"
          )}
        >
          <label
            htmlFor={id}
            className={cn(
              "mb-1 block text-base font-medium text-gray-700",
              labelClassName
            )}
          >
            {label || name}
            {required && <span className="ml-1 text-red-500">{"*"}</span>}
          </label>

          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={"default"}
                className={cn(
                  "w-full justify-start !px-3 !py-2 text-left text-base font-normal",
                  !field.value && "text-muted-foreground",
                  variant === "under_line" &&
                    "rounded-none border-b border-l-0 border-r-0 border-t-0 border-primary bg-transparent p-0 text-black hover:bg-transparent",
                  variant === "transparent" &&
                    "bg-transparent hover:bg-transparent",
                  variant === "default" && "bg-gray-100 hover:bg-gray-200",
                  variant === "outline" && "border-2 border-gray-300",
                  variant === "ghost" && "bg-transparent hover:bg-transparent",
                  buttonClassName
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field.value ? (
                  format(field.value, "PPP", {
                    locale: locale === "ar" ? arSA : undefined,
                  })
                ) : (
                  <span className="text-gray-500">
                    {placeholder || t("Pick a date")}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                captionLayout="dropdown"
                components={{
                  Caption: (props) => (
                    <CaptionWithSelectMonthAndYear
                      {...props}
                      onChange={(date) => {
                        field.onChange(date);
                        if (onChange) onChange(date);
                      }}
                    />
                  ),
                }}
                fixedWeeks
                locale={locale === "ar" ? arSA : undefined}
                mode="single"
                selected={field.value}
                onSelect={(date) => {
                  field.onChange(date);
                  if (onChange) onChange(date);
                  setIsOpen(false);
                }}
                initialFocus
                disabled={disableDatesBeforeMinDate}
                {...calendarProps}
              />
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

export default DateField;
