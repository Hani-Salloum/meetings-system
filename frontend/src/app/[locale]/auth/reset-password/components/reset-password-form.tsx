"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Eye, EyeOff, Lock } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);

  const fields = useMemo(
    () =>
      prepareFields({
        code: {
          yup: Yup.string().required(t("Validation.Required")),
          type: "input",
          component: InputField,
          componentProps: () => ({
            required: true,
            label: t("Auth.EmailConfirmationCode"),
            placeholder: t("Auth.EmailConfirmationCode"),
            containerClassName: "col-span-12",
          }),
        },

        password: {
          yup: Yup.string()
            .required(t("Validation.Required"))
            .min(8, t("Validation.MinLength8")),
          type: "input",
          component: InputField,
          componentProps: () => ({
            label: t("Validation.Label.Password"),
            placeholder: t("Validation.Placeholder.Password2"),
            required: true,
            type: showPassword ? "text" : "password",
            containerClassName: "col-span-12",
            prefix: <Lock className="h-4 w-4" />,
            suffix: showPassword ? (
              <button type={"button"} onClick={() => setShowPassword(false)}>
                <Eye className="h-4 w-4" />
              </button>
            ) : (
              <button type={"button"} onClick={() => setShowPassword(true)}>
                <EyeOff className="h-4 w-4" />
              </button>
            ),
          }),
        },
      }),
    [t]
  );

  const FormHooks = useFormBuilder(fields, {
    defaultValues: {},
  });

  type FormData = Parameters<typeof FormHooks.handleSubmit>[0];
  const onSubmit: FormData = async (data: any) => {
    setSending(true);
    const action = async () => {
      // TODO reset action
    };

    decorateToaster(action(), {
      afterSuccess() {
        //     router.push(`/${locale}`);
      },
      afterFailed() {
        //     FormHooks.setError("code", {
        //       message: "The code is incorrect.",
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
            title={t("Auth.Sent1")}
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
