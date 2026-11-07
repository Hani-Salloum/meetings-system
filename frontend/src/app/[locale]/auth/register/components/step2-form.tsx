"use client";

import { useRouter } from "@/i18n/routing";
import { useEffect, useMemo, useState } from "react";

import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";

import { Client } from "@/configs/api";

import CountryCodeAutocompleteField from "@/components/FormBuilder/FormFields/countries-fields/country-code-autocomplete-field";
import InputField from "@/components/FormBuilder/FormFields/input-field";
import FormBuilder from "@/components/FormBuilder/form-builder";
import useFormBuilder from "@/components/FormBuilder/hooks/use-form-builder";
import prepareFields from "@/components/FormBuilder/utils/prepare-fields";
import Yup from "@/components/FormBuilder/utils/yup";
import LoadingButton from "@/components/shared/loading-button";
import type { Locale } from "@/i18n/routing";

import { useRegisterContext } from "./register-form";
import RegisterStepper from "./register-stepper";
import { toast } from "sonner";

export default function RegisterStep2({ locale }: { locale: Locale }) {
  const t = useTranslations();
  const router = useRouter();
  const { setStep1, setStep2, data, setEmailForVerification } = useRegisterContext();
  const [sending, setSending] = useState(false);
  const [step1Data, setStep1Data] = useState({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedStep1 = localStorage.getItem("registerStep1");
      console.log("Saved step1 data from localStorage:", savedStep1);

      if (savedStep1) {
        try {
          const parsedData = JSON.parse(savedStep1);
          console.log("Parsed step1 data:", parsedData);
          setStep1(parsedData);
          setStep1Data(parsedData);
        } catch (error) {
          console.error("Error parsing saved step1 data:", error);
        }
      } else {
        console.warn("No step1 data found in localStorage");
      }
    }

  }, []);
  const fieldsStep2 = useMemo(
    () =>
      prepareFields({
        country: {
          yup: Yup.string().required(t("Validation.Required")),
          type: "input",
          component: InputField,
          componentProps: {
            label: t("Validation.Label.Country"),
            labelClassName: "text-white/90 text-sm font-medium mb-2 block",
            placeholder: t("Validation.Placeholder.Country"),
            required: true,
            inputClassName:"text-white/80 border border-white placeholder:text-white/50 rounded-xl  focus:!border-custom_2-primary hover:!border-custom_2-primary ",
            containerClassName: "col-span-12 md:col-span-6",
            variant: "outline",

          },
        },
        country_code: {
          yup: Yup.string().required(t("Validation.Required")),
          type: "country-autocomplete",
          component: CountryCodeAutocompleteField,
          componentProps: {
            color: "#fff",
            required: true,
            variant: "outline",
            labelClassName:"text-white/90 text-sm font-medium mb-2 block",
            containerClassName: "col-span-6 ",
            label: t("Validation.Label.CountryCode"),
            getOptions: (country) => ({
              label: `${locale === "ar" ? `+${country.callingCode}  (${country.nameAr})` : `+${country.callingCode}  (${country.nameEn})`}`,
              value: `+${country.callingCode}`,
              key: country.alpha2Code,
              filterKeys: [country.callingCode, country.nameEn, country.nameAr],
              icon: country.flag,
            }),
          },
        },
        phone: {
          yup: Yup.string().required(t("Validation.Required")),
          type: "input",
          component: InputField,
          componentProps: {
            label: t("Validation.Label.PhoneNumber"),
            labelClassName: "text-white/90 text-sm font-medium mb-2 block",
            placeholder: t("Validation.Placeholder.PhoneNumber"),
            required: true,
            containerClassName: "col-span-12 md:col-span-6",
            variant: "outline",
           inputClassName: "text-white/80 border border-white placeholder:text-white/50 rounded-xl  focus:!border-custom_2-primary hover:!border-custom_2-primary ",

          },
        },
        email: {
          yup: Yup.string()
            .email(t("Validation.InvalidEmail"))
            .required(t("Validation.Required")),
          type: "input",
          component: InputField,
          componentProps: {
            label: t("Validation.Label.Email"),
            labelClassName: "text-white/90 text-sm font-medium mb-2 block",
            placeholder: t("Validation.Placeholder.Email"),
            required: true,
            containerClassName: "col-span-12 md:col-span-6",
            variant: "outline",
            inputClassName:"text-white/80 border border-white placeholder:text-white/50 rounded-xl  focus:!border-custom_2-primary hover:!border-custom_2-primary ",

            prefix: <Mail className="h-4 w-4 text-white/50" />,
          },
        },
      }),
    [t, locale]
  );
  const formHooksStep2 = useFormBuilder(fieldsStep2, {
    defaultValues: data.step2,
  });
  const handleNext = async () => {
    const valid = await formHooksStep2.trigger();
    if (valid) {
      try {
        setSending(true);
        const step2Data = formHooksStep2.getValues();
        setStep2(step2Data);
        const step1DataToUse = Object.keys(step1Data).length > 0 ? step1Data : data.step1;

        const registrationData = {
          ...step1DataToUse,
          ...step2Data
        };

        console.log("Final registration data:", registrationData);

        // Send registration data to API
         const res=await Client.noAuth.post("business/auth/signup", registrationData);
        if (res && res.status == 200){
          toast.success(t("Register.RegisteredSuccessfully"));

        }
        // Store email for verification
        const email = step2Data.email;
        setEmailForVerification(email);
        formHooksStep2.reset();

        // Store step2 data in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("registerStep2", JSON.stringify(step2Data));
        }

        router.push("/auth/register/step3");
      } catch (error: any) {
        console.error("Registration error:", error);
        toast.error(error.response?.data?.message || "Registration failed. Please try again.");
      } finally {
        setSending(false);
      }
    }
  };
  return (
    <div className="w-full min-h-[600px] rounded-3xl bg-white/15 p-6 shadow-[0px_0px_0px_rgba(0,0,0,0.12),0px_10px_15px_rgba(0,0,0,0.086)] backdrop-blur-[12px]">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-bold text-white">
          {t("Register.Welcome")}
        </h1>
        <p className="text-sm mb-6 text-white/70">{t("Register.Description")}</p>
        <RegisterStepper currentStep={1} locale={locale} />
        <div className={`text-white/70 pl-4 ${locale == "ar" ? "text-right" : "text-left"}`}>
        <p className="text-lg mb-4 font-medium">{t("Register.EnterInfoCorrectly")}</p>
        <p  className="text-sm mb-2 font-medium">{t("Register.EmailConfirmationInfo")}</p>
      </div>
      </div>
      <form
        className="space-y-4 rounded-xl p-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleNext();
        }}
      >
        <FormBuilder fields={fieldsStep2} FormHooks={formHooksStep2} />
        <div className="flex gap-3 pt-4">

          <LoadingButton
            sending={sending}
            color="#3B82F6"
            title={t("Buttons.Submit")}
            loadingText={t("Auth.Sent")}
            buttonProps={{
              type: "submit",
              className:
                "flex-1 bg-custom_2-primary hover:bg-custom_2-primary-600 text-white rounded-xl h-12 font-medium transition-colors border-none",
            }}
          />
        </div>
      </form>
    </div>
  );
}
