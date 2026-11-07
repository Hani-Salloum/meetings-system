"use client";

import { useState } from "react";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

import InputField from "@/components/FormBuilder/FormFields/input-field";
import FormBuilder from "@/components/FormBuilder/form-builder";
import useFormBuilder from "@/components/FormBuilder/hooks/use-form-builder";
import prepareFields from "@/components/FormBuilder/utils/prepare-fields";
import Yup from "@/components/FormBuilder/utils/yup";
import { Button } from "@/components/ui/button";
import { auth, Client } from "@/configs/api";
import decorateToaster from "@/utils/decorate-toaster";

export default function LoginForm() {
  const t = useTranslations('Auth');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false)

  const fields = prepareFields({
    email: {
      yup: Yup.string()
        .email(t("Invalid email format"))
        .required(t("This field is required")),
      type: "input",
      component: InputField,
      componentProps: {
        label: t("Email"),
        placeholder: t("Enter your email"),
        containerClassName: "col-span-12",
        prefix: <Mail className="h-5 w-5 text-gray-400" />,
      },
    },
    password: {
      yup: Yup.string()
        .required(t("This field is required"))
        .min(8, t("Password must be at least 8 characters")),
      type: "input",
      component: InputField,
      componentProps: {
        type: showPassword ? "text" : "password",
        label: t("Password"),
        placeholder: t("Enter your password"),
        containerClassName: "col-span-12",
        prefix: <Lock className="h-4 w-4 text-custom_2-primary" />,
            suffix: showPassword ? (
              <button type={"button"} onClick={() => setShowPassword(false)}>
                <Eye className="h-4 w-4 text-custom_2-primary" />
              </button>
            ) : (
              <button type={"button"} onClick={() => setShowPassword(true)}>
                <EyeOff className="h-4 w-4 text-[#8355A0]" />
              </button>
            ),
      },
    },
  });

  const formHooks = useFormBuilder(fields, {
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);

    await decorateToaster(
      Client.noAuth.post("auth/login", data),
      {
        successMessage: t("Login successful!"),
        errorMessage: t("Invalid email or password"),
        afterSuccess: (response) => {
          const { user, token } = response.data.data;
          localStorage.setItem(auth.admin, token);
          localStorage.setItem(auth.user_id, user.id);
          localStorage.setItem(auth.user_email, user.email);
          router.push("/dashboard");
        },
        afterFailed: (error) => {
          formHooks.setError("email", {
            message: t("Invalid email or password"),
          });
        },
        afterFinally: () => {
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="w-full max-w-4xl">
        <div className="bg-primary rounded-3xl shadow-2xl p-8 flex max-md:flex-col items-center justify-center border border-gray-100">
          <div className="flex-1">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-foreground to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <LogIn className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {t("Welcome Back")}
            </h1>
            <p className="text-gray-500">
              {t("Sign in to continue to your account")}
            </p>
          </div>
          </div>

          <div className="space-y-6 flex-1">
            <FormBuilder
              fields={fields}
              FormHooks={formHooks}
              containerClassName="space-y-4"
            />

            <Button
              onClick={formHooks.handleSubmit(onSubmit)}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary-foreground to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 rounded-xl font-semibold text-lg shadow-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  {t("Logging in...")}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <LogIn className="w-5 h-5" />
                  {t("Sign In")}
                </span>
              )}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}