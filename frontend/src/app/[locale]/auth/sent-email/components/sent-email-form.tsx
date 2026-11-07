"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { useLocale, useTranslations } from "next-intl";

import InputField from "@/components/FormBuilder/FormFields/input-field";
import FormBuilder from "@/components/FormBuilder/form-builder";
import useFormBuilder from "@/components/FormBuilder/hooks/use-form-builder";
import prepareFields from "@/components/FormBuilder/utils/prepare-fields";
import Yup from "@/components/FormBuilder/utils/yup";
import LoadingButton from "@/components/shared/loading-button";
import { cn } from "@/lib/utils";
import decorateToaster from "@/utils/decorate-toaster";

function RegisterFormComponent() {
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const [sending, setSending] = useState(false);
  const fields = useMemo(
    () =>
      prepareFields({
        email: {
          yup: Yup.string()
            .email(t("Validation.Email"))
            .required(t("Validation.Required")),
          type: "input",
          component: InputField,
          componentProps: () => ({
            required: true,
            type: "email",
            label: t("email"),
            placeholder: t("email"),
            containerClassName: "col-span-12",
          }),
        },
      }),
    [t]
  );

  const FormHooks = useFormBuilder(fields, {
    defaultValues: {
      email: "",
    },
  });

  type FormData = Parameters<typeof FormHooks.handleSubmit>[0];
  const onSubmit: FormData = async (data: any) => {
    setSending(true);
    const action = async () => {};

    decorateToaster(action(), {
      afterSuccess() {
        //     localStorage.setItem("email", data.email);
        //     router.push(`/${locale}/auth/reset-password`);
      },
      afterFailed() {
        //     FormHooks.setError("email", {
        //       message: "There is no account registered with this email.",
        //     });
      },
    });
    setSending(false);
  };

  return (
    <div className="w-full">
      <form
        onSubmit={FormHooks.handleSubmit(onSubmit)}
        className="w-full space-y-12"
      >
        <FormBuilder fields={fields} FormHooks={FormHooks} />

        <div className="flex flex-col items-center">
          <LoadingButton
            sending={sending}
            title={t("Auth.Sent Email")}
            loadingText={t("Auth.Sent")}
            buttonProps={{
              type: "submit",
              className: cn("w-64"),
            }}
          />
        </div>
      </form>
    </div>
  );
}

export default RegisterFormComponent;
