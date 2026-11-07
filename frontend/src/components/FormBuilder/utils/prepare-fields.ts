import { FieldValues, UseFormReturn } from "react-hook-form";

import { Field } from "../types/all-fields";

type prepareFieldsParams<T> = Record<
  string,
  Field<T, UseFormReturn<FieldValues>>
>;

const prepareFields = <T extends prepareFieldsParams<T>>(fields: T) => {
  return fields;
};

export default prepareFields;
