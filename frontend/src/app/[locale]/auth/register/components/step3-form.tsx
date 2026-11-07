"use client";

import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { Circles } from "react-loader-spinner";
import { z } from "zod";

// import FlipText from "@/components/ui/flip-text";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Client } from "@/configs/api";
import { useRouter } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";

import { useRegisterContext } from "./register-form";
import RegisterStepper from "./register-stepper";

type OTPValuesType = {
  code: string;
};

export default function RegisterStep3({ locale }: { locale: Locale }) {
  const t = useTranslations();
  const router = useRouter();
  const { data, setStep1, setStep2, setEmailForVerification } = useRegisterContext();
  const [sending, setSending] = useState(false);
  const [linkVisible, setLinkVisible] = useState(false);
  const [invalidCode, setInvalidCode] = useState(false);

  const formSchema = z.object({
    code: z.string().min(1, t("Validation.Required")),
  });

  const form = useForm<OTPValuesType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  // Load step1 and step2 data from localStorage when component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load step1 data
      const savedStep1 = localStorage.getItem("registerStep1");
      if (savedStep1) {
        try {
          const parsedData = JSON.parse(savedStep1);
          setStep1(parsedData);
        } catch (error) {
          console.error("Error parsing saved step1 data:", error);
        }
      }

      // Load step2 data
      const savedStep2 = localStorage.getItem("registerStep2");
      if (savedStep2) {
        try {
          const parsedData = JSON.parse(savedStep2);
          setStep2(parsedData);

          // Set email for verification if available
          if (parsedData.email) {
            setEmailForVerification(parsedData.email);
          }
        } catch (error) {
          console.error("Error parsing saved step2 data:", error);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLinkVisible(true);
    }, 180000); // Show resend link after 3 minutes
    return () => clearTimeout(timer);
  }, []);
  const onSubmit = async (formData: OTPValuesType) => {
    setInvalidCode(false);
    setSending(true);
    try {
      const response = await Client.noAuth.post("/business/auth/CheckCode", {
        code: formData.code,
        email: data.emailForVerification || data.step2?.email,
      });
      if (response && response.data) {
        router.push("/auth/login");
      }
    } catch (error: any) {
      setInvalidCode(true);
      form.setError("code", {
        message: error.response?.data?.message || t("Register.RegistrationFailed"),
      });
    } finally {
      setSending(false);
    }
  };

  // const handleResendCode = async () => {
  //   try {
  //     await Client.noAuth.post("business/auth/resend-code", {
  //       email: data.emailForVerification || data.step2?.email,
  //     });
  //     // You could add a toast notification here if you have one
  //   } catch (error) {
  //     console.error("Error resending code:", error);
  //   }
  // };
  return (
    <div className="w-full rounded-3xl bg-white/15 p-6 shadow-[0px_0px_0px_rgba(0,0,0,0.12),0px_10px_15px_rgba(0,0,0,0.086)] backdrop-blur-[12px]">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-bold text-white">
          {t("Register.Welcome")}
        </h1>
        <p className="text-sm text-white/70">{t("Register.Description")}</p>
      </div>
      <RegisterStepper currentStep={2} locale={locale} />
      <div className={`text-white/70 pl-4 ${locale === "ar" ? "text-right" : "text-left"} rounded-xl p-6 py-8`}>
        <p className="text-lg mb-4 font-medium">{t("Register.EnterCode")}</p>
        <p  className="text-sm mb-2 font-medium">{t("Auth.CodeSentToEmail")}</p>
      </div>
      <div className="rounded-xl p-6">

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
            <div dir="ltr" className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-center">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>

                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {invalidCode ? (
                <div className="flex items-center justify-center">
                  <p className="text-sm font-bold text-red-600">
                    {t("Invalid code")}
                  </p>
                </div>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full bg-custom_2-primary hover:bg-custom_2-primary/80 text-white rounded-xl h-12 font-medium transition-colors border-none"
            >
              {sending ? (
                <div className="flex items-center justify-center gap-2">
                  <p className="text-white">{t("Auth.Verifying")}</p>
                  <Circles
                    height="25"
                    width="25"
                    color="white"
                    ariaLabel="circles-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                  />
                </div>
              ) : (
                t("Register.ConfirmAccount")
              )}
            </button>
            {/* {linkVisible && (
              <button
                type="button"
                className="w-full text-center"
                onClick={handleResendCode}
              >
                <FlipText
                  className="text-base text-white/80"
                  word={t("Auth.ResendCode")}
                />
              </button>
            )} */}
          </form>
        </Form>
      </div>
    </div>
  );
}
