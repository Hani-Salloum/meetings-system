"use client";

import { BaseDialog } from "../base";
import { FieldMetaFromTypes } from "./use-view-data";
import types from "./viewer-types";

interface ViewDialogProps<T> {
  data: T | null;
  meta: FieldMetaFromTypes<T>[];
  defaultGridSize?: string;
  className?: string;
  baseDialogProps: Omit<React.ComponentProps<typeof BaseDialog>, "children">;
  closeText?: string;
}

export default function ViewDialog<T>({
  data,
  meta,
  defaultGridSize = "col-span-1",
  className = "",
  baseDialogProps,
  closeText,
}: ViewDialogProps<T>) {
  if (!baseDialogProps.isOpen || !data) return null;

  // تجهيز الحقول مع القيم
  const preparedFields = meta
    .filter((field) => !field.hidden)
    .map((field) => {
      const value = field.valueGetter
        ? field.valueGetter(data)
        : field.key
          ? data[field.key]
          : undefined;

      return {
        ...field,
        value,
        gridSize: field.gridSize || defaultGridSize,
      };
    });

  return (
    <BaseDialog {...baseDialogProps}>
      <div className={`grid grid-cols-12 gap-4 p-4 ${className}`}>
        {preparedFields.map((field: any, idx) => {
          const Component = types[field.type as keyof typeof types];
          if (!Component) return null;

          return (
            <div key={idx} className={field.gridSize}>
              <Component
                label={field.label}
                value={field.value}
                {...field.extraProps}
              />
            </div>
          );
        })}
      </div>
    </BaseDialog>
  );
}
