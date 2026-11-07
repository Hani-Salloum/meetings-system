"use client";

import { useCallback, useId, useMemo, useState } from "react";

import { format } from "date-fns";
import { arSA, enUS } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  Controller,
  ControllerRenderProps,
  FieldValues,
} from "react-hook-form";
import { Button } from "src/components/FormBuilder/ui/button";
import { Calendar } from "src/components/FormBuilder/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "src/components/FormBuilder/ui/popover";
import {
  ScrollArea,
  ScrollBar,
} from "src/components/FormBuilder/ui/scroll-area";
import { cn } from "src/lib/utils";

import { Locale } from "@/i18n/routing";

import { DateTimeFieldProps } from "../types/all-fields";

const DateTimeField = <T,>({
  name,
  control,
  required = false,
  placeholder,
  containerClassName,
  labelClassName,
  errorClassName,
  onChange,
  label,
  ...calendarProps
}: DateTimeFieldProps<T>) => {
  const id = useId();
  const t = useTranslations("date_time_field");
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale() as Locale;
  const hours = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

  const handleTimeChange = useCallback(
    (
      field: ControllerRenderProps<FieldValues, string>,
      date: Date | undefined,
      type: "hour" | "minute" | "ampm",
      value: string
    ) => {
      if (date) {
        const newDate = new Date(date);
        if (type === "hour") {
          newDate.setHours(
            (parseInt(value) % 12) + (newDate.getHours() >= 12 ? 12 : 0)
          );
        } else if (type === "minute") {
          newDate.setMinutes(parseInt(value));
        } else if (type === "ampm") {
          const currentHours = newDate.getHours();
          newDate.setHours(
            value === "PM" ? currentHours + 12 : currentHours - 12
          );
        }
        field.onChange(newDate);
        if (onChange) onChange(newDate);
      }
    },
    [onChange]
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div
          className={cn("col-span-12 w-full space-y-2 p-2", containerClassName)}
        >
          <label
            htmlFor={id}
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              labelClassName
            )}
          >
            {label || name}
            {required && <span className="ml-1 text-red-500">{"*"}</span>}
          </label>

          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !field.value && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                {field.value ? (
                  format(field.value, "MM/dd/yyyy hh:mm aa", {
                    locale: locale === "ar" ? arSA : enUS,
                  })
                ) : (
                  <span>{placeholder || t("MM/DD/YYYY hh:mm aa")}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <div className="sm:flex">
                <Calendar
                  mode="single"
                  selected={field.value}
                  // todo fix this
                  // @ts-expect-error - there is deferent types for onSelect
                  onSelect={(date) => {
                    if (date) {
                      const newDate = field.value
                        ? new Date(field.value)
                        : new Date();

                      newDate.setFullYear(date.getFullYear());
                      newDate.setMonth(date.getMonth());
                      newDate.setDate(date.getDate());
                      field.onChange(newDate);
                      if (onChange) onChange(newDate);
                    }
                  }}
                  initialFocus
                  locale={locale === "ar" ? arSA : enUS}
                  {...calendarProps}
                />
                <div className="flex flex-col divide-y sm:h-[300px] sm:flex-row sm:divide-x sm:divide-y-0">
                  <ScrollArea className="w-64 sm:w-auto">
                    <div className="flex p-2 sm:flex-col">
                      {hours.reverse().map((hour) => (
                        <Button
                          key={hour}
                          size="icon"
                          variant={
                            field.value &&
                            field.value.getHours() % 12 === hour % 12
                              ? "default"
                              : "ghost"
                          }
                          className="aspect-square shrink-0 sm:w-full"
                          onClick={() =>
                            handleTimeChange(
                              field,
                              field.value,
                              "hour",
                              hour.toString()
                            )
                          }
                        >
                          {hour}
                        </Button>
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" className="sm:hidden" />
                  </ScrollArea>
                  <ScrollArea className="w-64 sm:w-auto">
                    <div className="flex p-2 sm:flex-col">
                      {Array.from({ length: 12 }, (_, i) => i * 5).map(
                        (minute) => (
                          <Button
                            key={minute}
                            size="icon"
                            variant={
                              field.value && field.value.getMinutes() === minute
                                ? "default"
                                : "ghost"
                            }
                            className="aspect-square shrink-0 sm:w-full"
                            onClick={() =>
                              handleTimeChange(
                                field,
                                field.value,
                                "minute",
                                minute.toString()
                              )
                            }
                          >
                            {minute.toString().padStart(2, "0")}
                          </Button>
                        )
                      )}
                    </div>
                    <ScrollBar orientation="horizontal" className="sm:hidden" />
                  </ScrollArea>
                  <ScrollArea className="w-64 sm:w-auto">
                    <div className="flex p-2 sm:flex-col">
                      {["AM", "PM"].map((ampm) => (
                        <Button
                          key={ampm}
                          size="icon"
                          variant={
                            field.value &&
                            ((ampm === "AM" && field.value.getHours() < 12) ||
                              (ampm === "PM" && field.value.getHours() >= 12))
                              ? "default"
                              : "ghost"
                          }
                          className="aspect-square shrink-0 sm:w-full"
                          onClick={() =>
                            handleTimeChange(field, field.value, "ampm", ampm)
                          }
                        >
                          {t(ampm)}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
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

export default DateTimeField;
