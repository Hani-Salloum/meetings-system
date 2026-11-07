"use client";

import { useEffect, useMemo, useState } from "react";

import { Check, Eye, EyeOff, Lock } from "lucide-react";
import { useTranslations } from "next-intl";

import InputField from "@/components/FormBuilder/FormFields/input-field";
import FormBuilder from "@/components/FormBuilder/form-builder";
import useFormBuilder from "@/components/FormBuilder/hooks/use-form-builder";
import prepareFields from "@/components/FormBuilder/utils/prepare-fields";
import Yup from "@/components/FormBuilder/utils/yup";
import LoadingButton from "@/components/shared/loading-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BaseUrl } from "@/configs/api";
import { Locale, useRouter } from "@/i18n/routing";

export default function ResetPasswordForm({
  locale,
  token,
}: {
  locale: Locale;
  token: string;
}) {
  const router = useRouter();
  const t = useTranslations();
  const [sending, setSending] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fields = useMemo(
    () =>
      prepareFields({
        password: {
          yup: Yup.string()
            .min(8, t("Validation.MinLength6"))
            .required(t("Validation.Required")),
          type: "input",
          component: InputField,
          variant: "default",
          componentProps: {
            label: t("Auth.ResetPasswordLabel"),
            placeholder: t("Auth.ResetPasswordPlaceholder"),
            required: true,
            containerClassName: "col-span-12",
            labelClassName: "text-white/80 mb-4",
            inputClassName: "text-white/70 rounded-xl h-12 font-medium transition-colors border border-white/30 bg-transparent hover:bg-white/10 hover:border hover:border-custom_2-primary",
            type: showPassword ? "text" : "password",
            prefix: <Lock className="h-4 w-4" />,
            suffix: (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            ),
          },
        },
        confirmPassword: {
          yup: Yup.string()
            .oneOf([Yup.ref("password")], t("Validation.PasswordMatch"))
            .required(t("Validation.Required")),
          type: "input",
          component: InputField,
          componentProps: {
            label: t("Auth.ConfirmPasswordLabel"),
            placeholder: t("Auth.ConfirmPasswordPlaceholder"),
            required: true,
            labelClassName: "text-white/80 mb-4",
            containerClassName: "col-span-12 mb-6",
            inputClassName:
              "w-full text-white/70 rounded-xl h-12 font-medium transition-colors border border-white/30 bg-transparent hover:bg-white/10 hover:border hover:border-custom_2-primary",
            type: showConfirmPassword ? "text" : "password",
            prefix: <Lock className="h-4 w-4" />,
            suffix: (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            ),
          },
        },
      }),
    [t, showPassword, showConfirmPassword]
  );

  const FormHooks = useFormBuilder(fields, {
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  type FormData = Parameters<typeof FormHooks.handleSubmit>[0];
  const onSubmit: FormData = async (data) => {
    try {
      setSending(true);
      const response = await fetch(`${BaseUrl}/business/auth/reset_password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          random_url_token: token,
          password: data.password,
          confirm_password: data.confirmPassword,
          lang: locale,
        }),
      });

      if (response.ok) {
        setShowSuccessDialog(true);
      } else {
        const errorData = await response.json();
        console.error("Reset password error:", errorData);
        FormHooks.setError("password", {
          message: errorData?.message || t("Auth.ResetPasswordError"),
        });
      }
    } catch (error) {
      console.error("Reset password error:", error);
      FormHooks.setError("password", {
        message: t("Auth.ResetPasswordError"),
      });
    }
    setSending(false);
  };

  return (
    <div className="w-full rounded-3xl bg-white/15 p-6 shadow-[0px_0px_0px_rgba(0,0,0,0.12),0px_10px_15px_rgba(0,0,0,0.086)] backdrop-blur-[12px]">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-bold text-white">
          {t("Auth.ResetPassword")}
        </h1>
        <p className="text-sm text-white/70">
          {t("Auth.ResetPasswordDescription")}
        </p>
      </div>

      <form
        onSubmit={FormHooks.handleSubmit(onSubmit)}
        className="w-full space-y-6"
      >
        <FormBuilder fields={fields} FormHooks={FormHooks} />
        <div className="flex flex-col items-center">
          <LoadingButton
            sending={sending}
            title={t("Auth.ResetPassword")}
            loadingText={t("Auth.ResettingPassword")}
            buttonProps={{
              type: "submit",
              className:
              "w-full text-white/70 rounded-xl h-12 font-medium transition-colors border border-white/30 bg-transparent hover:bg-white/10 hover:border hover:border-custom_2-primary",            }}
          />
        </div>
      </form>
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] sm:max-w-md md:max-w-lg">
          <DialogHeader className="space-y-4 text-center">
            <div className="mx-auto rounded-full bg-green-100 p-3">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-center text-xl font-semibold">
              {t("Auth.PasswordResetSuccess")}
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              {t("Auth.PasswordResetSuccessMessage")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 sm:mt-8">
            <Button
              onClick={() => {
                setShowSuccessDialog(false);
                router.push("/auth/login");
              }}
              className="w-full py-5 text-base font-semibold"
            >
              {t("Auth.BackToLogin")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
