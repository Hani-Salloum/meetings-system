import { Fragment, useMemo } from "react";

import { DevTool } from "@hookform/devtools";
import { useFieldArray, useWatch } from "react-hook-form";
import { cn } from "src/lib/utils";

import { AllFieldsTypes, Field } from "./types/all-fields";

const FormBuilder = <T extends Record<string, Field<T>>>({
  fields,
  FormHooks,
  containerClassName,
  className,
  enableDevTools = false,
}: FormBuilderProps<T>) => {
  const formContainerClassName = useMemo(
    () => cn("grid w-full grid-cols-12 gap-3", containerClassName, className),
    [className, containerClassName]
  );
  return (
    <div className={formContainerClassName}>
      {Object.entries(fields).map(([key, field]) => (
        <FieldsRenderer
          key={key}
          FieldName={key}
          fieldsToWatch={field.fieldsToWatch ? field.fieldsToWatch : []}
          field={field}
          FormHooks={FormHooks}
          formContainerClassName={formContainerClassName}
        />
      ))}
      {enableDevTools && <DevTool control={FormHooks.control} />}
    </div>
  );
};

type FieldRenderProps<
  T extends Record<string, Field<T>>,
  G extends "Field" | "Field Array" | "Mixed",
> = {
  FormHooks: UseFormReturn<T>;
  fieldsToWatch: string[];
  formContainerClassName: string;
  field: G extends "Mixed"
    ? Field<T>
    : G extends "Field Array"
      ? { type: "field-array" } & Field<T>
      : { type: Exclude<AllFieldsTypes, "field-array"> } & Field<T>;
  FieldName: string;
};

function FieldsRenderer<T extends Record<string, Field<T>>>({
  FieldName,
  FormHooks,
  field,
  formContainerClassName,
}: FieldRenderProps<T, "Mixed">) {
  if (field.type === "field-array") {
    return (
      <FieldArrayHelper
        FormHooks={FormHooks}
        fieldsToWatch={field.fieldsToWatch ? field.fieldsToWatch : []}
        fieldArrayContainerClassName={field.containerClassName}
        field={field}
        FieldName={FieldName}
        formContainerClassName={formContainerClassName}
      />
    );
  } else {
    return (
      <WatchHelper
        FormHooks={FormHooks}
        fieldsToWatch={field.fieldsToWatch ? field.fieldsToWatch : []}
        field={field}
        FieldName={FieldName}
      />
    );
  }
}

function FieldArrayHelper<T extends Record<string, Field<T>>>({
  FormHooks,
  fieldsToWatch = [],
  field,
  FieldName,
  formContainerClassName,
  fieldArrayContainerClassName,
}: {
  FormHooks: UseFormReturn<T>;
  fieldsToWatch: string[];
  field: { type: "field-array" } & Field<T>;
  FieldName: string;
  formContainerClassName: string;
  fieldArrayContainerClassName?: string;
}) {
  const {
    formState: { errors },
  } = FormHooks;
  const fieldError = errors[FieldName as keyof typeof errors]?.root;

  const WatchValues = useWatch({
    control: FormHooks.control,
    disabled: !fieldsToWatch.length,
    name: fieldsToWatch,
  });
  const fieldArrayHooks = useFieldArray({
    control: FormHooks.control,
    name: FieldName,
  });

  return (
    <Fragment key={`${FieldName}-field-array`}>
      {fieldArrayHooks.fields.map((ArrayField, index) => {
        const _fields = field.fields({
          FormHooks,
          WatchValues,
          fieldArrayHooks,
          index,
          id: ArrayField.id,
        });
        return (
          <div
            key={`${FieldName}.${ArrayField.id}`}
            className={cn(
              formContainerClassName,
              "col-span-12",
              fieldArrayContainerClassName
            )}
          >
            {Object.entries(_fields).map(([key, field]) => (
              <FieldsRenderer
                FieldName={`${FieldName}.${index}.${key}`}
                FormHooks={FormHooks}
                field={field}
                fieldsToWatch={field.fieldsToWatch ? field.fieldsToWatch : []}
                formContainerClassName={formContainerClassName}
                key={`${FieldName}.${index}.${key}.${ArrayField.id}`}
              />
            ))}
          </div>
        );
      })}
      {fieldError && (
        <span
          className={cn(
            "col-span-12 text-sm text-red-500",
            field.errorClassName
          )}
        >
          {fieldError.message as string}
        </span>
      )}
    </Fragment>
  );
}

function WatchHelper<T extends Record<string, Field<T>>>({
  FormHooks,
  fieldsToWatch = [],
  field,
  FieldName,
}: {
  FormHooks: UseFormReturn<T>;
  fieldsToWatch: string[];
  field: Field<T>;
  FieldName: string;
}) {
  const WatchValues = useWatch({
    control: FormHooks.control,
    disabled: !fieldsToWatch.length,
    name: fieldsToWatch,
  });
  const WatchValuesObject = useMemo(() => {
    const _ob: any = {};
    fieldsToWatch.forEach((field, index) => {
      _ob[field] = WatchValues[index];
    });
    return _ob;
  }, [fieldsToWatch, WatchValues]);
  if (field.type === "field-array") return "";
  return (
    <field.component
      name={FieldName}
      control={FormHooks.control}
      {...(typeof field.componentProps === "function"
        ? field.componentProps({
            ...FormHooks,
            WatchValues: WatchValuesObject,
          })
        : field.componentProps)}
    />
  );
}

export default FormBuilder;
