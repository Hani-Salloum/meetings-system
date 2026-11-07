"use client";

import { useEffect, useMemo, useState } from "react";

import { Check, Mail } from "lucide-react";
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

export default function ForgetPasswordForm({ locale }: { locale: Locale }) {
  const t = useTranslations();
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const fields = useMemo(
    () =>
      prepareFields({
        email: {
          yup: Yup.string()
            .email(t("Validation.InvalidEmail"))
            .required(t("Validation.Required")),
          type: "input",
          component: InputField,
          componentProps: {
            label: t("Validation.Label.Email"),
            labelClassName: "mb-4 text-white/80",
            inputClassName: "text-white/70 rounded-xl h-12 font-medium transition-colors border border-white/30 bg-transparent hover:bg-white/10 hover:border hover:border-custom_2-primary",
            placeholder: t("Validation.Placeholder.Email1"),
            required: true,
            containerClassName: "col-span-12",
            variant: "outline",
            prefix: <Mail className="h-4 w-4 text-custom_2-primary"  />,
          },
        },
      }),
    [t]
  );

  const FormHooks = useFormBuilder(fields, {
    defaultValues: {
      email: "",
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
      const result = await fetch(`${BaseUrl}/business/auth/forgot_password`, {
        method: "POST",
        body: JSON.stringify({ email: data.email, lang: locale }),
        headers: { "Content-Type": "application/json" },
      });

      if (result.ok) {
        setShowSuccessDialog(true);
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      } else {
        const errorData = await result.json();
        FormHooks.setError("email", {
          message:
            errorData.message === "The email is incorrect"
              ? t("Auth.IncorrectEmail")
              : errorData.message || t("Auth.ForgotPasswordError"),
        });
      }
    } catch {
      FormHooks.setError("email", {
        message: t("Auth.ForgotPasswordError"),
      });
    }
    setSending(false);
  };

  return (
    <div className="w-full  rounded-3xl bg-white/15 p-6 shadow-[0px_0px_0px_rgba(0,0,0,0.12),0px_10px_15px_rgba(0,0,0,0.086)] backdrop-blur-[12px]">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-bold text-white">
          {t("Auth.ForgotYourPassword")}
        </h1>
        <p className="text-sm text-white/70">
          {t("Auth.ForgotPasswordDescription")}
        </p>
      </div>

      <form
        onSubmit={FormHooks.handleSubmit(onSubmit)}
        className="w-full space-y-6 px-2"
      >
        <FormBuilder fields={fields} FormHooks={FormHooks} />
        <LoadingButton
          sending={sending}
          color="#3B82F6"
          title={t("Auth.SendResetLink")}
          loadingText={t("Auth.Sending")}
          buttonProps={{
            type: "submit",
            className:
              "w-full text-white/70 rounded-xl h-12 font-medium transition-colors border border-white/30 bg-transparent hover:bg-white/10 hover:border hover:border-custom_2-primary",
          }}
        />
      </form>
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] sm:max-w-md md:max-w-lg">
          <DialogHeader className="space-y-4 text-center">
            <div className="mx-auto rounded-full bg-green-100 p-3">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-center text-xl font-semibold">
              {t("Auth.CheckEmail")}
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              {t("Auth.ResetLinkSent")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 sm:mt-8">
            <Button
              onClick={() => setShowSuccessDialog(false)}
              className="w-full py-5 text-base font-semibold"
            >
              {t("OK")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
