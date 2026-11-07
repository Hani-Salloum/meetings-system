"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { Lock, Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import InputField from "@/components/FormBuilder/FormFields/input-field";
import prepareFields from "@/components/FormBuilder/utils/prepare-fields";
import Yup from "@/components/FormBuilder/utils/yup";
import { FormDialog, useFormDialog } from "@/components/dialog/form-dialog";
import { Button } from "@/components/ui/button";
import ShinyButton from "@/components/ui/shiny-button";
import { useCrudMutation } from "@/hooks/use-crud-mutation";
import AutocompleteFieldServer from "../FormBuilder/FormFields/autocomplete-field-server";
import { Client } from "@/configs/api";

interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  first_name: string,
  last_name: string,
  created_at: string;
  updated_at: string;
  user_types:{
    label?: string
    value?: string
  }
}

const handleError = (error: any, variables: any, t: any) => {
  const data = error.response?.data as
    | { data?: Record<string, string | string[]> }
    | undefined;
  if (data?.data && typeof data.data === "object") {
    const messages: string[] = [];
    Object.values(data.data).forEach((val) => {
      if (Array.isArray(val)) {
        messages.push(...val);
      } else if (typeof val === "string") {
        messages.push(val);
      }
    });
    if (messages.length > 0) {
      toast.error(messages.map((ele) => t(ele)).join(" "));
    }
  } else {
    toast.error(t("An unknown error occurred"));
  }
  console.log("error is ", error, variables);
};

function AddUpdateUser({
  record,
  queryKey,
  isUpdate = false,
}: {
  record?: User;
  refetch: () => void;
  isUpdate?: boolean;
  queryKey: string[];
}) {
  const t = useTranslations();

  const groupFields = prepareFields({
    first_name: {
      yup: Yup.string().required(t("This field is required")),
      type: "input",
      component: InputField,
      componentProps: {
        label: t("First Name"),
        placeholder: t("Enter the first name"),
        containerClassName: "col-span-12",
        prefix: <Icon icon="mdi:account" className="text-gray-600" />,
      },
    },
    last_name: {
      yup: Yup.string().required(t("This field is required")),
      type: "input",
      component: InputField,
      componentProps: {
        label: t("Last Name"),
        placeholder: t("Enter the last name"),
        containerClassName: "col-span-12",
        prefix: <Icon icon="mdi:account" className="text-gray-600" />,
      },
    },
    email: {
      yup: Yup.string().email().required(t("This field is required")),
      type: "email",
      component: InputField,
      componentProps: {
        type: "email",
        label: t("Email"),
        placeholder: t("Enter the email"),
        containerClassName: "col-span-12",
        prefix: <Icon icon="mdi:email-outline" className="text-gray-600" />,
      },
    },
    password: {
      yup: Yup.string()
        .required(t("This field is required"))
        .min(8, t("Password must be at least 8 characters")),
      type: "input",
      component: InputField,
      componentProps: {
        type: "text",
        label: t("Password"),
        placeholder: t("Enter password"),
        containerClassName: "col-span-12",
        prefix: <Lock className="h-4 w-4 text-custom_2-primary" />,
      },
    },
    user_types: {
      yup: Yup.number().required(t("This field is required")),
      type: "autocomplete-server",
      component: AutocompleteFieldServer,
      componentProps: {
        label: t("User Type"),
        placeholder: t("Select user type"),
        serverAction: async (value: string) => {
          return (
            await Client.admin().get('/admin/users/user-types', {
              params: {
                page: 1,
                pageSize: 1000,
                search: value ?? undefined
              }
            })
          ).data.data
        },
        getOptions: (response) => {
          return response.map((item: any) => ({
            value: item.id.toString(),
            label: item.name
          }))
        }
      },
    },
  });

  const addMutation = useCrudMutation<Partial<User>>({
    url: "/admin/users/",
    method: "post",
    invalidateQueries: queryKey,
    optimisticUpdate: {
      queryKey,
      updater: (
        oldData: any,
        newItem: Partial<User> & { id: string | number }
      ) => {
        if (!oldData || !oldData.data) return oldData;

        const updatedData = [newItem, ...oldData.data];

        return {
          ...oldData,
          data: updatedData,
          total: oldData.total + 1,
        };
      },
    },
    onError: (error, variables) => handleError(error, variables, t),
  });

  const editMutation = useCrudMutation<User>({
    url: `/admin/users/${record?.id}`,
    method: "put",
    successMessage: t("User updated successfully"),
    errorMessage: t("Failed to update user"),
    invalidateQueries: queryKey,
    optimisticUpdate: {
      queryKey,
      updater: (oldData: any, updatedItem: User) => {
        if (!oldData || !oldData.data) return oldData;

        return {
          ...oldData,
          data: oldData.data.map((item: User) =>
            item.id === updatedItem.id ? updatedItem : item
          ),
        };
      },
    },
    onError: (error, variables) => handleError(error, variables, t),
  });

  const addUserDialog = useFormDialog(groupFields, {
    size: "lg",
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
    onSubmit: async (data: any) => {
      const newUserData = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        user_type_ids: [Number(data.user_types.value)]
      };

      await addMutation.mutateAsync(newUserData);
    },
    title: t("Add New User"),
    submitText: t("Save"),
    cancelText: t("Cancel"),
    formOptions: {
      mode: "onBlur",
      shouldFocusError: true,
    },
  });

  const editUserDialog = useFormDialog(groupFields, {
    size: "lg",
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
    onSubmit: async (data: any) => {
      if (!record) return;

      const editUserData = {
        ...record,
        first_name: data.first_name ?? record.first_name,
        last_name: data.last_name ?? record.last_name,
        email: data.email ?? record.email,
        password: data.password ?? record.password,
        user_type_ids: [Number(data.user_types.value) ?? Number(record.user_types.value)],
        id: record.id,
      };

      await editMutation.mutateAsync(editUserData);
    },
    title: t("Edit User"),
    submitText: t("Save"),
    cancelText: t("Cancel"),
    formOptions: {
      mode: "onBlur",
      shouldFocusError: true,
    },
  });

  return (
    <div>
      {!isUpdate ? (
        <>
          <ShinyButton
            className="w-full rounded-[8px] bg-primary text-primary-foreground shadow-lg sm:rounded-lg"
            onClick={() => {
              addUserDialog.openAdd();
            }}
          >
            {t("Add New User")}
          </ShinyButton>
          <FormDialog
            {...addUserDialog.dialogProps}
            formClassName="grid grid-cols-12 gap-4"
          />
        </>
      ) : (
        <>
          <Button
            variant="ghost"
            onClick={() => {
              editUserDialog.openEdit(record as any);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <FormDialog
            {...editUserDialog.dialogProps}
            formClassName="grid grid-cols-12 gap-4"
          />
        </>
      )}
    </div>
  );
}

export default AddUpdateUser;
