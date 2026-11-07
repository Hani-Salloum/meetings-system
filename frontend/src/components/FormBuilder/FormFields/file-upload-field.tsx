"use client";

import Image from "next/image";
import { useMemo } from "react";

import { Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { cn } from "src/lib/utils";

import { ImageBaseUrl } from "@/configs/api";

import { FileFieldProps } from "../types/all-fields";

const FileUploadField = <T,>({
  name,
  control,
  label,
  required = false,
  containerClassName,
  errorClassName,
  labelClassName,
  onChange,
  multiple = false,
  accept,
  ...fileProps
}: FileFieldProps<T>) => {
  const id = useMemo(() => `${name}-file-upload`, [name]);
  const t = useTranslations();

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange: fieldOnChange, value },
        fieldState: { error },
      }) => (
        <div
          className={cn(
            "col-span-12 flex w-full flex-col gap-2",
            containerClassName
          )}
        >
          <label
            htmlFor={id}
            className={cn(
              "cursor-pointer text-sm font-medium text-gray-700",
              labelClassName
            )}
          >
            {label || name}
            {required && <span className="ml-1 text-red-500">{"*"}</span>}
          </label>

          <label
            htmlFor={id}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-200 active:bg-gray-300"
          >
            <Upload className="h-5 w-5 text-gray-500" />
            <span>{multiple ? t("Upload files") : t("Upload File")}</span>
          </label>

          <input
            id={id}
            type="file"
            className="hidden"
            onChange={(e) => {
              const files = e.target.files;
              if (!files) return;

              const newValue: any = multiple ? Array.from(files) : files[0];

              fieldOnChange(newValue);
              if (onChange) onChange(newValue);
            }}
            accept={accept}
            multiple={multiple}
            {...fileProps}
          />

          {value && (
            <div className="grid grid-cols-3 gap-2">
              {(Array.isArray(value) ? value : [value]).map((img, index) => (
                <Image
                  key={index}
                  src={
                    img instanceof File || img instanceof Blob
                      ? URL.createObjectURL(img)
                      : `${ImageBaseUrl}/${img}`
                  }
                  alt={`Uploaded Image ${index}`}
                  className="flex h-[150px] w-full items-center justify-center rounded object-contain"
                  width={100}
                  height={100}
                />
              ))}
            </div>
          )}

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

export default FileUploadField;
