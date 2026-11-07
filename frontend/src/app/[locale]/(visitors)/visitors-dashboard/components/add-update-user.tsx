"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import CheckboxField from "@/components/FormBuilder/FormFields/checkbox-field";
import InputField from "@/components/FormBuilder/FormFields/input-field";
import prepareFields from "@/components/FormBuilder/utils/prepare-fields";
import Yup from "@/components/FormBuilder/utils/yup";
import { FormDialog, useFormDialog } from "@/components/dialog/form-dialog";
import { Button } from "@/components/ui/button";
import ShinyButton from "@/components/ui/shiny-button";
import { useCrudMutation } from "@/hooks/use-crud-mutation";

interface User {
  id: number;
  name: string;
  email: string;
  confirmed_email: boolean;
  email_confirmation_code: string | null;
  active: boolean;
  available: boolean;
  language: string;
  created_at: string;
  updated_at: string;
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
    name: {
      yup: Yup.string().required(t("This field is required")),
      type: "input",
      component: InputField,
      componentProps: {
        label: t("Name"),
        placeholder: t("Enter the full name"),
        containerClassName: "col-span-12 sm:col-span-6",
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
        containerClassName: "col-span-12 sm:col-span-6",
        prefix: <Icon icon="mdi:email-outline" className="text-gray-600" />,
      },
    },
    confirmed_email: {
      yup: Yup.boolean(),
      type: "checkbox",
      component: CheckboxField,
      componentProps: {
        label: t("Email Confirmed"),
        containerClassName: "col-span-12 sm:col-span-6",
      },
    },
    active: {
      yup: Yup.boolean(),
      type: "checkbox",
      component: CheckboxField,
      componentProps: {
        label: t("Active"),
        containerClassName: "col-span-12 sm:col-span-6",
      },
    },
    available: {
      yup: Yup.boolean(),
      type: "checkbox",
      component: CheckboxField,
      componentProps: {
        label: t("Available"),
        containerClassName: "col-span-12 sm:col-span-6",
      },
    },
  });

  const addMutation = useCrudMutation<Partial<User>>({
    url: "/api/users",
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
    url: `/api/users`,
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
      name: "",
      email: "",
      confirmed_email: false,
      active: true,
      available: true,
    },
    onSubmit: async (data: any) => {
      const newUserData: Partial<User> = {
        name: data.name,
        email: data.email,
        language: data.language,
        confirmed_email: data.confirmed_email,
        active: data.active,
        available: data.available,
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
      name: "",
      email: "",
      confirmed_email: false,
      active: true,
      available: true,
    },
    onSubmit: async (data: any) => {
      if (!record) return;

      const safeEditUserData: User = {
        ...record,
        name: data.name ?? record.name,
        email: data.email ?? record.email,
        language: data.language ?? record.language,
        confirmed_email: data.confirmed_email ?? record.confirmed_email,
        active: data.active ?? record.active,
        available: data.available ?? record.available,
        id: record.id,
      };

      await editMutation.mutateAsync(safeEditUserData);
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
            {t("Add New")}
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
