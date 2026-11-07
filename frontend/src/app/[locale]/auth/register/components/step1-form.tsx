"use client";

import { useMemo, useState } from "react";

import { ChevronDown, Eye, EyeOff, Lock } from "lucide-react";
import { useTranslations } from "next-intl";

import CheckboxField from "@/components/FormBuilder/FormFields/checkbox-field";
import InputField from "@/components/FormBuilder/FormFields/input-field";
import FormBuilder from "@/components/FormBuilder/form-builder";
import useFormBuilder from "@/components/FormBuilder/hooks/use-form-builder";
import prepareFields from "@/components/FormBuilder/utils/prepare-fields";
import Yup from "@/components/FormBuilder/utils/yup";
import LoadingButton from "@/components/shared/loading-button";
import { useRouter } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";

import { useRegisterContext } from "./register-form";
import RegisterStepper from "./register-stepper";
import AutocompleteField from "@/components/FormBuilder/FormFields/autocomplete-field";

export default function RegisterStep1({ locale }: { locale: Locale }) {
  const t = useTranslations();
  const router = useRouter();
  const { setStep1, data } = useRegisterContext();
  const [sending, setSending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const fieldsStep1 = useMemo(
    () =>
      prepareFields({
        first_name: {
          yup: Yup.string().required(t("Validation.Required")),
          type: "input",
          component: InputField,
          componentProps: {
            label: t("Validation.Label.FirstName"),
            labelClassName: "text-white/90 text-sm font-medium mb-2 block",
            placeholder: t("Validation.Placeholder.FirstName"),
            required: true,
            inputClassName:
              "text-white border border-white placeholder:text-white/50 rounded-xl h-12 focus:!border-custom_2-primary hover:!border-custom_2-primary ",
            containerClassName: "col-span-6",
            variant: "outline",
          },
        },
        last_name: {
          yup: Yup.string().required(t("Validation.Required")),
          type: "input",
          component: InputField,
          componentProps: {
            label: t("Validation.Label.LastName"),
            labelClassName: "text-white/90 text-sm font-medium mb-2 block",
            placeholder: t("Validation.Placeholder.LastName"),
            required: true,
            containerClassName: "col-span-6",
            variant: "outline",
            inputClassName:
              "text-white/80 border border-white placeholder:text-white/50 rounded-xl  focus:!border-custom_2-primary hover:!border-custom_2-primary ",
          },
        },
        company_name: {
          yup: Yup.string().required(t("Validation.Required")),
          type: "input",
          component: InputField,
          componentProps: {
            label: t("Validation.Label.CompanyName"),
            labelClassName: "text-white/90 text-sm font-medium mb-2 block",
            placeholder: t("Validation.Placeholder.CompanyName"),
            required: true,
            inputClassName:
              "text-white border border-white placeholder:text-white/50 rounded-xl h-12 focus:!border-custom_2-primary hover:!border-custom_2-primary ",
            containerClassName: "col-span-12 md:col-span-6",
            variant: "outline",
          },
        },
        title: {
          yup: Yup.string().required(t("Validation.Required")),
          type: "autocomplete",
          component: AutocompleteField,
          componentProps: {
            label: t("Validation.Label.Title"),
            inputClassName:
              "text-white border border-white placeholder:text-white/50 rounded-xl h-12 focus:!border-custom_2-primary hover:!border-custom_2-primary ",
            labelClassName: "text-white/90 text-sm font-medium mb-2 block",
            placeholder: t("Validation.Placeholder.Title"),
            required: true,
            options: [
              { value: "Mr", label: t("Validation.Label.Mr") },
              { value: "Mrs", label: t("Validation.Label.Mrs") },
              { value: "Ms", label: t("Validation.Label.Ms") },
            ],
            containerClassName: "col-span-6",
            variant: "outline",
            buttonClassName:
              "w-full bg-transparent border border-white text-white placeholder:text-white/50 rounded-xl h-12 focus:border-custom_2-primary hover:border-custom_2-primary focus:ring-1 focus:ring-custom_2-primary",
            suffix: <ChevronDown className="h-4 w-4 text-white/50" />,
          },
        },
        password: {
          yup: Yup.string()
            .required(t("Validation.Required"))
            .min(8, "Minimum 8 characters"),
          type: "input",
          component: InputField,
          componentProps: () => ({
            label: t("Validation.Label.Password"),
            labelClassName: "text-white/90 text-sm font-medium mb-2 block",
            placeholder: t("Validation.Placeholder.Password"),
            required: true,
            type: showPassword ? "text" : "password",
            containerClassName: "col-span-12",
            variant: "outline",
            inputClassName:
              "text-white/80 border border-white placeholder:text-white/50 rounded-xl h-12 focus:!border-custom_2-primary hover:!border-custom_2-primary pl-12 pr-12",
            prefix: <Lock className="h-4 w-4 text-white/50" />,
            suffix: showPassword ? (
              <button type={"button"} onClick={() => setShowPassword(false)}>
                <Eye className="h-4 w-4 text-white/50 hover:text-white" />
              </button>
            ) : (
              <button type={"button"} onClick={() => setShowPassword(true)}>
                <EyeOff className="h-4 w-4 text-white/50 hover:text-white" />
              </button>
            ),
          }),
        },
        terms: {
          type: "checkbox",
          component: CheckboxField,
          componentProps: {
            label: t("Register.AgreeTerms"),
            labelClassName: "text-white/90 text-sm",
            containerClassName: "col-span-12 mt-4",
          },
        },
      }),
    [showPassword, t]
  );
  const formHooksStep1 = useFormBuilder(fieldsStep1, {
    defaultValues: data.step1,
  });
  const handleNext = async () => {
    const valid = await formHooksStep1.trigger();
    if (valid) {
      const formData = formHooksStep1.getValues();
      setStep1(formData);
      if (typeof window !== "undefined") {
        localStorage.setItem("registerStep1", JSON.stringify(formData));
      }

      router.push("/auth/register/step2");
    }
  };
  return (
    <div className="w-full rounded-3xl bg-white/15 p-6 shadow-[0px_0px_0px_rgba(0,0,0,0.12),0px_10px_15px_rgba(0,0,0,0.086)] backdrop-blur-[12px]">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-bold text-white">
          {t("Register.Welcome")}
        </h1>
        <p className="text-sm text-white/70">{t("Register.Description")}</p>
      </div>
      <RegisterStepper currentStep={0} locale={locale} />
      <div className={`text-white/70 pl-4 ${locale == "ar" ? "text-right" : "text-left"}`}>
        <p className="text-lg mb-4 font-medium">{t("Register.EnterInfoCorrectly")}</p>
        <p  className="text-sm mb-2 font-medium">{t("Register.Step1")}</p>
      </div>
      <form
        className="space-y-4 rounded-xl p-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleNext();
        }}
      >
        <FormBuilder fields={fieldsStep1} FormHooks={formHooksStep1} />
        <div className="pt-4">
          <LoadingButton
            sending={sending}
            color="#3B82F6"
            title={t("Register.Next")}
            loadingText={t("Auth.Sent")}
            buttonProps={{
              type: "submit",
              className:
                "w-full bg-custom_2-primary hover:bg-custom_2-primary/80 text-white rounded-xl h-12 font-medium transition-colors border-none",
            }}
          />
        </div>
      </form>
    </div>
  );
}
