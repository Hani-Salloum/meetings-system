import Image from "next/image";

import { getTranslations } from "next-intl/server";

import LanguageSwitcherSelect from "@/components/shared/language-switcher-select";
import BlurFade from "@/components/ui/blur-fade";
import WordRotate from "@/components/ui/word-rotate";
import { Link, Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import ResetPasswordForm from "../../components/reset-password-form";

interface ResetPasswordPageProps {
  params: Promise<{
    locale: Locale;
    token: string;
  }>;
}

export default async function ResetPasswordPage({
  params,
}: ResetPasswordPageProps) {
  const { locale, token } = await params;
  const t = await getTranslations("Auth");
  const validatedLocale = locale === "en" || locale === "ar" ? locale : "en";
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/register.jpg"
          alt="Background"
          fill
          priority
          className="object-cover"
        />
      </div>
      {/* Content Container */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        {/* Top Navigation */}
        <Link
          href="/auth/login"
          locale={validatedLocale}
          className={cn(
            "absolute top-6 z-20",
            validatedLocale === "ar" ? "right-6" : "left-6"
          )}
        >
          <WordRotate
            duration={8000}
            className="text-sm text-white/80 transition-colors hover:text-white"
            words={[t("ResetPassword"), t("LoginLabel")]}
          />
        </Link>
        <div className="absolute top-6 z-20 ltr:right-6 rtl:left-6">
          <LanguageSwitcherSelect
            defaultValue={validatedLocale}
            label={t("Language")}
          />
        </div>
        {/* Main Form Card */}
        <BlurFade
          direction="up"
          inView={true}
          className="flex w-full items-center justify-center"
        >
          <div className="mx-auto w-[672px] rounded-3xl border border-white/10 bg-black/70 backdrop-blur-sm">
            <ResetPasswordForm locale={locale} token={token as string} />
          </div>
        </BlurFade>
      </div>
    </main>
  );
}
