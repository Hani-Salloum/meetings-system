"use client";

import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { Circles } from "react-loader-spinner";
import { z } from "zod";

import FlipText from "@/components/ui/flip-text";
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
import { Locale, useRouter } from "@/i18n/routing";

type OTPValuesType = {
  code: string;
};

function FormComponent({ locale }: { locale: Locale }) {
  const router = useRouter();
  const t = useTranslations();

  const [sending, setSending] = useState(false);
  const [linkVisible, setLinkVisible] = useState(false);
  const [invalidCode, setInvalidCode] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLinkVisible(true);
    }, 180000);
    return () => clearTimeout(timer);
  }, []);

  const formSchema = z.object({
    code: z.string().min(1, t("Validation.Required")),
  });

  const form = useForm<OTPValuesType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: OTPValuesType) => {
    setInvalidCode(false);
    setSending(true);
    const action = async () => {
      const email = localStorage.getItem("email") || "";
      // return await verify_email({ email: email, code: data.code });
    };

    // DecorateToastV2(action(), {
    //   afterSuccess: () => {
    //     router.push("/");
    //   },
    //   afterFailed: () => {
    //     setSending(false);
    //     form.setError("code", {
    //       message: "Invalid code",
    //     });
    //   },
    // });

    setSending(false);
  };

  const handleResendCode = async () => {
    const action = async () => {
      const email = localStorage.getItem("email") || "";
      // return await resend_email_confirmation_code({ email: email });
    };

    // DecorateToastV2(action(), {
    //   afterFailed: () => {
    //     setSending(false);
    //   },
    // });
  };

  return (
    <Form {...form}>
      <div className="w-full">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-12"
        >
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
            ) : (
              ""
            )}
          </div>

          <div className="flex flex-col items-center justify-between">
            <button
              type="submit"
              disabled={sending}
              className="mb-4 flex-1 rounded-lg bg-custom-primary-accent px-12 py-2 text-base font-normal text-white"
            >
              {sending ? (
                <div className="flex items-center justify-center gap-2">
                  <p className="text-white">{t("Auth.Sent")}</p>
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
                t("Buttons.ConfirmCodeButton")
              )}
            </button>
            {linkVisible && (
              <button className="flex-1" onClick={handleResendCode}>
                <FlipText
                  className="text-base text-custom-dark"
                  word={t("Auth.ResendCode")}
                />
              </button>
            )}
          </div>
        </form>
      </div>
    </Form>
  );
}

export default FormComponent;
