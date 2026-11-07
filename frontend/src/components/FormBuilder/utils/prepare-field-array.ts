import { FieldValues, UseFormReturn } from "react-hook-form";

import { Field, FieldArrayFunctionProps } from "../types/all-fields";
import Yup from "./yup";

type prepareFieldArrayParams<T> = Record<
  string,
  Field<T, UseFormReturn<FieldValues>>
>;

type _<T> = T extends object
  ? {
      [k in keyof T]: T[k];
    }
  : T;
type RequiredKeys<T extends object> = Exclude<keyof T, OptionalKeys<T>>;
type OptionalKeys<T extends object> = {
  [k in keyof T]: undefined extends T[k] ? k : never;
}[keyof T];
type MakePartial<T extends object> = {
  [k in OptionalKeys<T> as T[k] extends never ? never : k]?: T[k];
} & {
  [k in RequiredKeys<T> as T[k] extends never ? never : k]: T[k];
};
type AnyObject = {
  [k: string]: any;
};
type MakeKeysOptional<T> = T extends AnyObject ? _<MakePartial<T>> : T;
type ReturnYupType<T extends prepareFieldArrayParams<T>> = Yup.ArraySchema<
  | MakeKeysOptional<
      _<
        {} & Yup.TypeFromShape<
          {
            [K in keyof T as T[K] extends { yup: Yup.Schema }
              ? K
              : never]: T[K]["yup"];
          },
          Yup.AnyObject
        >
      >
    >[]
  | undefined,
  Yup.AnyObject,
  "",
  ""
>;
type PrepareFieldArrayOptionsType<
  T extends prepareFieldArrayParams<T>,
  TReturn = ReturnYupType<T>,
> = {
  HandleYup: (schema: ReturnYupType<T>) => TReturn;
  fieldsToWatch?: string[];
  containerClassName?: string;
  errorClassName?: string;
};

const prepareFieldArray = <
  T extends prepareFieldArrayParams<T>,
  TReturn = ReturnYupType<T>,
  FH = UseFormReturn<FieldValues>,
>(
  fields: (props?: FieldArrayFunctionProps<FH>) => T,
  options: PrepareFieldArrayOptionsType<T, TReturn>
) => {
  const _fields = fields();
  const entries = Object.entries(_fields);
  type K = keyof T;
  const yup = Yup.array().of(
    Yup.object().shape(
      Object.fromEntries(
        entries.map(([key, field]) => [key, field.yup])
      ) as Record<K, T[K]["yup"]>
    )
  ) as ReturnYupType<T>;

  const result = {
    type: "field-array" as const,
    yup: options.HandleYup(yup),
    containerClassName: options.containerClassName,
    errorClassName: options.errorClassName,
    fields,
  };
  return result;
};

export default prepareFieldArray;
