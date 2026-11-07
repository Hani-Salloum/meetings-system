"use client";

import { useMemo } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { UseFormProps, useForm } from "react-hook-form";
import Yup from "src/components/FormBuilder/utils/yup";

import { AllFieldsTypes } from "../types/all-fields";

type FormField = {
  yup?: Yup.Schema;
  type: AllFieldsTypes;
};

export type FormFields = Record<string, FormField>;

type FormSchema<T extends FormFields> = {
  [K in keyof T]: Yup.InferType<
    T[K]["yup"] extends Yup.Schema ? T[K]["yup"] : never
  >;
};

// exclude custom fields
// type FormSchema<T extends FormFields> = {
//   [K in keyof T]: Yup.InferType<
//     T[K]["yup"] extends Yup.Schema
//       ? T[K]["type"] extends Exclude<AllFieldsTypes, "custom">
//         ? T[K]["yup"]
//         : never
//       : never
//   >;
// };

type YupSchema<T extends FormFields> = Yup.ObjectSchema<FormSchema<T>>;

type FormValues<T extends FormFields> = Yup.InferType<YupSchema<T>>;

export type InferFormValuesType<T extends FormFields> = FormValues<T>;

const useFormBuilder = <T extends FormFields>(
  fields: T,
  options?: Omit<UseFormProps<FormValues<T>>, "resolver">
) => {
  const schema = useMemo(
    () =>
      Yup.object({
        ...Object.entries(fields).reduce((acc, [name, field]) => {
          if (field.yup) {
            return {
              ...acc,
              [name]: field.yup,
            };
          } else {
            return acc;
          }
        }, {}),
      }) as YupSchema<T>,
    [fields]
  );

  const resolver = useMemo(() => yupResolver(schema), [schema]);

  const formHooks = useForm<FormValues<T>>({
    resolver,
    ...options,
  });

  return formHooks;
};

export default useFormBuilder;
