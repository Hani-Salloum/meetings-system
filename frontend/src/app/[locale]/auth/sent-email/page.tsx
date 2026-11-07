import { getTranslations } from "next-intl/server";

import LanguageSwitcherSelect from "@/components/shared/language-switcher-select";
import BlurFade from "@/components/ui/blur-fade";
import { LocaleParams } from "@/i18n/params";
import { cn } from "@/lib/utils";

import Form from "./components/sent-email-form";

export default async function LoginPage({ params }: { params: LocaleParams }) {
  const { locale } = await params;

  const t = await getTranslations("Auth");

  return (
    <main
      className={cn(
        "min-h-screen",
        "flex items-center justify-center",
        "relative"
      )}
    >
      <div className={cn("relative h-screen flex-[65%] overflow-scroll")}>
        <div className="absolute top-4 ltr:right-4 rtl:left-4">
          <LanguageSwitcherSelect
            defaultValue={locale}
            label={t("ChangeLanguage")}
          />
        </div>
        <div className={cn("flex min-h-screen items-center justify-center")}>
          <BlurFade
            direction="up"
            inView={true}
            className={cn(
              "flex flex-col items-center justify-center",
              "rounded-md p-4 shadow-[0_1px_5px_rgba(0,0,0,.15)]",
              "w-[90%] sm:w-[90%] md:w-[80%] lg:w-[60%] xl:w-[30%]"
            )}
          >
            <p className="mb-6 text-2xl text-custom-primary-accent">
              {t("ForgotYourPassword")}
            </p>
            <p className="mb-4 px-4 text-start text-[12px] md:text-sm">
              {t(
                "Enter your email and we will send you a verification code to reset your password"
              )}
            </p>
            <Form />
          </BlurFade>
        </div>
      </div>
    </main>
  );
}
