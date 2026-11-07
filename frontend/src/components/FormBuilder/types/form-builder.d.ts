type Fields<T> = T;

type Schema<T> = {
  [K in keyof T]: Yup.InferType<T[K]["yup"]>;
};

type UseFormReturn<T> = {
  watch: UseFormWatch<T>;
  getValues: UseFormGetValues<T>;
  getFieldState: UseFormGetFieldState<T>;
  setError: UseFormSetError<T>;
  clearErrors: UseFormClearErrors<T>;
  setValue: UseFormSetValue<T>;
  trigger: UseFormTrigger<T>;
  formState: FormState<T>;
  resetField: UseFormResetField<T>;
  reset: UseFormReset<T>;
  handleSubmit: UseFormHandleSubmit<T, unknown>;
  unregister: UseFormUnregister<T>;
  control: Control<T, unknown>;
  register: UseFormRegister<T>;
  setFocus: UseFormSetFocus<T>;
};

type FormBuilderProps<
  T extends Record<string, Field<Schema<T>>>,
  FH = UseFormReturn<Schema<T>>,
> = {
  fields: Fields<T>;
  FormHooks: FH;
  containerClassName?: string;
  className?: string;
  enableDevTools?: boolean;
};
