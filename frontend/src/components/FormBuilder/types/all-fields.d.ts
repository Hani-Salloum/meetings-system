import { ReadonlyURLSearchParams } from "next/navigation";

import { FlagComponent } from "country-flag-icons/react/3x2";
import { UseFieldArrayReturn } from "react-hook-form";
import type { TableDialogFieldValuesType } from "src/components/FormBuilder/FormFields/table-dialog-field/table-dialog-field";
import type { ButtonProps } from "src/components/FormBuilder/ui/button";
import type { CalendarProps } from "src/components/FormBuilder/ui/calendar";
import type { CheckboxProps } from "src/components/FormBuilder/ui/checkbox";
import type { RadioGroupProps } from "src/components/FormBuilder/ui/radio-group";
import type { SliderProps } from "src/components/ui/slider";

// تأكد من استيراد النوع الصحيح للـ Slider

type InputFieldProps<T = unknown> = {
  name: string;
  control: Control<T>;
  required?: boolean;
  type?: string;
  placeholder?: string;
  containerClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  labelClassName?: string;
  label?: string;
  hidden?: boolean;
  disabled?: boolean;
  onChange?: (value: string | number) => void;
  variant?: "default" | "outline" | "ghost" | "transparent" | "under_line";
  size?: "sm" | "md" | "lg";
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  min?: number;
  max?: number;
  color?: string;
};

type ListInputFieldProps<T = unknown> = {
  name: string;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  containerClassName?: string;
  errorClassName?: string;
  labelClassName?: string;
  buttonText?: string;
  maxItems?: number;
  onChange?: (value: string[]) => void;
};

type FileFieldProps<T = unknown> = {
  name: string;
  control: Control<T>;
  label?: string;
  required?: boolean;
  containerClassName?: string;
  errorClassName?: string;
  labelClassName?: string;
  onChange?: (value: File | FileList | null | string | number) => void;
  multiple?: boolean;
  accept?: string;
};

type AutocompleteOption = {
  value: string;
  label: string;
  /**
   * The key of the option to prevent duplicate value when mapping the options.
   * @default value
   */
  key?: string;
  filterKeys?: string[];
  icon?: React.FunctionComponent;
};

type AutocompleteFieldProps<T = unknown> = {
  name: string;
  label?: string | React.ReactNode;
  control: Control<T>;
  options: AutocompleteOption[];
  placeholder?: string;
  containerClassName?: string;
  errorClassName?: string;
  labelClassName?: string;
  buttonClassName?: string;
  required?: boolean;
  color?: string;
  hidden?: boolean;
  onChange?: (value: string | string[]) => void;
  multiple?: boolean;
  variant?: "default" | "outline" | "ghost" | "transparent" | "under_line";
  serverSearch?: (value: string) => void;
  oneTimeFetch?: (force?: boolean) => void;
  loading?: boolean;
  getOptionsError?: boolean;
  newValueManagement?: boolean;
} & Omit<ButtonProps, "onChange" | "value" | "variant">;

type AutocompleteFieldV2Props<T = unknown> = {
  name: string;
  label?: string | React.ReactNode;
  control: Control<T>;
  options: AutocompleteOption[];
  placeholder?: string;
  containerClassName?: string;
  errorClassName?: string;
  labelClassName?: string;
  buttonClassName?: string;
  required?: boolean;
  color?: string;
  multiple?: boolean;
  onChange?: (option: AutocompleteOption | AutocompleteOption[]) => void;
  variant?: "default" | "outline" | "ghost" | "transparent" | "under_line";
  serverSearch?: (value: string) => void;
  oneTimeFetch?: (force?: boolean) => void;
  loading?: boolean;
  getOptionsError?: boolean;
  newValueManagement?: boolean;
} & Omit<ButtonProps, "onChange" | "value" | "variant">;

type AutocompleteFieldServerProps<T> = Omit<
  AutocompleteFieldV2Props<T>,
  "options"
> & {
  multiple?: boolean;
  /**
   * The server action to fetch data and get the result.
   * @param value - The value to search for.
   * @returns The result of the server action.
   */
  serverAction: (value: string) => Promise<any>;
  /**
   * The function to get the options from the result of the server action.
   * @param result - The result of the server action.
   * @returns The options as an array of objects with label and value properties.
   */
  getOptions: (result: any) => { label: string; value: string }[];
};

type AutocompleteFieldOneTimeFetchProps<T> = Omit<
  AutocompleteFieldV2Props<T>,
  "options"
> & {
  /**
   * The server action to fetch data and get the result.
   * @returns The result of the server action.
   */
  oneTimeFetchAction: () => Promise<any>;
  /**
   * The function to get the options from the result of the server action.
   * @param result - The result of the server action.
   * @returns The options as an array of objects with label and value properties.
   */
  getOptions: (result: any) => AutocompleteOption[];
  options?: AutocompleteOption[];
};

type CountryCodeAutocompleteFieldProps<T> = {
  getOptions: (country: {
    nameEn: string | undefined;
    nameAr: string | undefined;
    alpha2Code: string;
    alpha3Code: string | undefined;
    numericCode: string | undefined;
    nationalityEn: string;
    nationalityAr: string;
    callingCode: string;
    flag: string | FlagComponent;
  }) => B extends {
    label: string;
    value: string;
  }
    ? B
    : never;
} & Omit<
  AutocompleteFieldProps<T>,
  "options" | "serverSearch" | "loading" | "getOptionsError" | "type"
>;

type CheckboxFieldProps<T = unknown> = {
  name: string;
  control: Control<T>;
  label?: string;
  containerClassName?: string;
  errorClassName?: string;
  labelClassName?: string;
  required?: boolean;
  onChange?: (checked: boolean) => void;
} & Omit<CheckboxProps, "checked" | "onChange" | "name">;

type SwitchFieldProps<T = unknown> = {
  name: string;
  control: Control<T>;
  label?: string;
  containerClassName?: string;
  errorClassName?: string;
  labelClassName?: string;
  required?: boolean;
  onChange?: (checked: boolean) => void;
} & Omit<CheckboxProps, "checked" | "onChange" | "name">;

type RadioFieldProps<T = unknown> = {
  name: string;
  label: string;
  control: Control<T>;
  options: AutocompleteOption[];
  containerClassName?: string;
  errorClassName?: string;
  hidden?: boolean;
  OptionsClassName?: string;
  OptionsLabelClassName?: string;
  RadioGroupClassName?: string;
  labelClassName?: string;
  title?: string;
  subTitle?: string;
  required?: boolean;
  onChange?: (value: string) => void;
} & Omit<RadioGroupProps, "value" | "onChange" | "defaultValue">;

type DateFieldProps<T = unknown> = {
  name: string;
  control: Control<T>;
  required?: boolean;
  placeholder?: string;
  containerClassName?: string;
  buttonClassName?: string;
  errorClassName?: string;
  labelClassName?: string;
  label?: string;
  variant?: "default" | "outline" | "ghost" | "transparent" | "under_line";
  onChange?: (value: Date | undefined) => void;
} & Omit<CalendarProps, "selected" | "onSelect" | "mode">;

type DateTimeFieldProps<T = unknown> = {
  name: string;
  control: Control<T>;
  required?: boolean;
  placeholder?: string;
  containerClassName?: string;
  errorClassName?: string;
  labelClassName?: string;
  label?: string;
  onChange?: (value: Date | undefined) => void;
} & Omit<CalendarProps, "selected" | "onSelect">;

type SliderFieldProps<T = unknown> = {
  name: string;
  control: Control<T>;
  label?: string;
  required?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  onChange?: (value: number[]) => void;
  defaultValue?: number[];
  max?: number;
  step?: number;
  className?: string;
} & Omit<SliderProps, "value" | "onValueChange" | "defaultValue">;

type handleGetDataType = (params: {
  setData: (data: any[]) => void;
  setPageCount: (pageCount: number) => void;
  searchParams: ReadonlyURLSearchParams;
}) => void;

type TableDialogField_GetColumns = (params: {
  handleAdd: (item: TableDialogFieldValuesType[number]) => void;
  handleDelete: (index: number) => void;
  selectedRows: TableDialogFieldValuesType;
}) => ColumnDef<any>[];

type TableDialogFieldProps<T = unknown> = {
  name: string;
  control: Control<T>;
  required?: boolean;
  containerClassName?: string;
  errorClassName?: string;
  label?: string;
  labelClassName?: string;
  hidden?: boolean;
  onChange?: (value: any) => void;
  handleGetData: handleGetDataType;
  getColumns: TableDialogField_GetColumns;
  CustomTitle?: (props: {
    item: TableDialogFieldValuesType[number];
  }) => React.ReactNode;
  CustomActions?: (props: {
    onChange: (...event: any[]) => void;
    item: TableDialogFieldValuesType[number];
    index: number;
    parsedValue: TableDialogFieldValuesType;
  }) => React.ReactNode;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type BaseField<T, FH> = {
  yup?: Yup.Schema;
  fieldsToWatch?: string[];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ComponentProps<T, FH, P> =
  | ((
      FormHooks: FH & { WatchValues: Record<string, any> }
    ) => Omit<P, "control" | "name">)
  | Omit<P, "control" | "name">;

type FieldConfig<T, FH, P> = BaseField<T, FH> & {
  component: React.ComponentType<P>;
  componentProps: ComponentProps<T, FH, P>;
};

type FieldArrayFunctionProps<FH> = {
  WatchValues: Record<string, any>;
  fieldArrayHooks: UseFieldArrayReturn<FieldValues, string, "id">;
  FormHooks: FH;
  index: number;
  id: string;
};

type Field<T = unknown, FH = UseFormReturn<unknown>> =
  | (FieldConfig<T, FH, InputFieldProps<T>> & {
      type: "input" | "email" | "number";
    })
  | (FieldConfig<T, FH, FileFieldProps<T>> & {
      type: "file";
    })
  | (FieldConfig<T, FH, ListInputFieldProps<T>> & {
      type: "list-input";
    })
  | (FieldConfig<T, FH, AutocompleteFieldProps<T>> & {
      type: "autocomplete";
    })
  | (FieldConfig<T, FH, AutocompleteFieldV2Props<T>> & {
      type: "autocomplete-v2";
    })
  | (FieldConfig<T, FH, CheckboxFieldProps<T>> & {
      type: "checkbox";
    })
  | (FieldConfig<T, FH, CheckboxFieldProps<T>> & {
      type: "switch";
    })
  | (FieldConfig<T, FH, RadioFieldProps<T>> & {
      type: "radio";
    })
  | (FieldConfig<T, FH, DateFieldProps<T>> & {
      type: "date";
    })
  | (FieldConfig<T, FH, DateTimeFieldProps<T>> & {
      type: "datetime";
    })
  | (FieldConfig<T, FH, SliderFieldProps<T>> & {
      type: "slider";
    })
  | (FieldConfig<T, FH, AutocompleteFieldServerProps<T>> & {
      type: "autocomplete-server";
    })
  | (FieldConfig<T, FH, AutocompleteFieldOneTimeFetchProps<T>> & {
      type: "autocomplete-one-time-fetch";
    })
  | (FieldConfig<T, FH, AutocompleteFieldDependenciesFetchProps<T>> & {
      type: "autocomplete-dependencies-fetch";
    })
  | (FieldConfig<T, FH, CountryCodeAutocompleteFieldProps<T>> & {
      type: "country-autocomplete";
    })
  | (FieldConfig<T, FH, TableDialogFieldProps<T>> & {
      type: "table-dialog-field";
    })
  | (FieldConfig<T, FH, Parameters<K>[0]> & {
      type: "custom";
      component: K;
    })
  | (BaseField<T, FH> & {
      type: "field-array";
      containerClassName?: string;
      errorClassName?: string;
      fields: (
        props: FieldArrayFunctionProps<FH>
      ) => Record<string, Field<T, FH>>;
    });

type AllFieldsTypes = Field["type"];
