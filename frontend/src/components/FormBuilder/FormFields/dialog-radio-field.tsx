"use client";

import { useId } from "react";

import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import {
  RadioGroup,
  RadioGroupItem,
} from "src/components/FormBuilder/ui/radio-group";
import { cn } from "src/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { RadioFieldProps } from "../types/all-fields";

const DialogRadioField = <T,>({
  name,
  control,
  options,
  hidden = false,
  containerClassName,
  title,
  subTitle,
  OptionsClassName,
  OptionsLabelClassName,
  RadioGroupClassName,
  errorClassName,
  onChange,
  ...radioProps
}: RadioFieldProps<T>) => {
  const id = useId();
  const t = useTranslations();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div
          className={cn(
            "col-span-12 space-y-2",
            { hidden: hidden },
            containerClassName
          )}
        >
          <div className="text-white">
            <h5>{title}</h5>
            <small>{subTitle}</small>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="group/modal-btn flex justify-center bg-primary px-8 text-white">
                <span className="text-center transition duration-500">
                  {t("Customize")}
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="overflow-y-auto border-none bg-accent p-0">
              <DialogHeader className="bg-primary p-4">
                <DialogTitle className="text-md text-center font-semibold text-white md:text-lg">
                  {title}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 p-4">
                <RadioGroup
                  onValueChange={(value: any) => {
                    field.onChange(value);
                    if (onChange) onChange(value);
                  }}
                  defaultValue={field.value}
                  className={cn("flex flex-col space-y-1", RadioGroupClassName)}
                  {...radioProps}
                >
                  {options.map((option) => (
                    <div
                      key={option.value}
                      className={cn(
                        "flex items-center space-x-2",
                        OptionsClassName
                      )}
                    >
                      <RadioGroupItem
                        className="bg-white"
                        value={option.value}
                        id={`${id}-${option.value}`}
                      />
                      <Label
                        className={OptionsLabelClassName}
                        htmlFor={`${id}-${option.value}`}
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </DialogContent>
          </Dialog>

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

export default DialogRadioField;
