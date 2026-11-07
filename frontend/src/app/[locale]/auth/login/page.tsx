import Image from "next/image";

import { getTranslations } from "next-intl/server";

import LanguageSwitcherSelect from "@/components/shared/language-switcher-select";
import BlurFade from "@/components/ui/blur-fade";
import { LocaleParams } from "@/i18n/params";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import LoginController from "./components/login-controller";

export default async function LoginPage({ params }: { params: LocaleParams }) {
  const { locale } = await params;

  const t = await getTranslations("Auth");

  return (
    <main
      className={cn(
        "min-h-screen",
        "flex items-center justify-center min-w-4xl",
        "relative overflow-hidden"
      )}
    >
      {/* Background Image */}
      {/* <div className="absolute inset-0 z-0">
        <Image
          src="/cover.jpg"
          alt="Background"
          fill
          priority
          className="object-cover"
        />
      </div> */}
      {/* Colored Overlay */}
      {/* <div className="z-1 absolute inset-0 bg-[#8355A0] opacity-60"></div> */}
      {/* <div className={cn("relative z-10 flex-[65%]")}>
        <Link
          href="/auth/register"
          locale={locale}
          className={cn(
            "absolute top-0",
            locale === "ar" ? "right-4" : "left-4"
          )}
        ></Link>
        <div className="absolute top-4 ltr:right-4 rtl:left-4">
          <LanguageSwitcherSelect defaultValue={locale} label={t("Language")} />
        </div>
        <div className={cn("flex min-h-screen items-center justify-center")}>
          <BlurFade
            direction="up"
            inView={true}
            className={cn(
              "flex flex-col items-center justify-center",
              "rounded-[12px] p-4 shadow-[0_0px_20px_rgba(0,0,0,.5)] sm:p-8",
              "min-h-[543px] w-[464px]",
              "border-[1px] border-[#8355A0]/30 bg-[#1a1a2e] bg-opacity-90"
            )}
          >

          </BlurFade>
        </div>
      </div> */}
      <LoginController />
    </main>
  );
}
