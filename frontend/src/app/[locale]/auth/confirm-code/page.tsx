import Link from "next/link";

import { getTranslations } from "next-intl/server";

import BlurFade from "@/components/ui/blur-fade";
import WordRotate from "@/components/ui/word-rotate";
import { LocaleParams } from "@/i18n/params";
import { cn } from "@/lib/utils";

import CountDown from "./components/count-down";
import Form from "./components/form";
import ImageHero from "./components/image-hero";

export default async function ConfirmCode({
  params,
}: {
  params: LocaleParams;
}) {
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
      <Link
        href={{
          pathname: `/${locale}/auth/register`,
        }}
        className="absolute right-4 top-0"
      >
        <WordRotate
          duration={8000}
          className="text-sm text-custom-dark-primary"
          words={[t("HaveAnAccount"), t("LoginLabel")]}
        />
      </Link>
      <div className={cn("flex flex-[65%] items-center justify-center")}>
        <BlurFade
          direction="up"
          inView={true}
          className={cn(
            "flex flex-col items-center justify-center",
            "rounded-md p-4 shadow-[0_1px_5px_rgba(0,0,0,.15)] sm:p-8",
            "w-[90%] sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[55%]"
          )}
        >
          <p className="mb-12 text-2xl text-custom-primary-accent">
            {t("EnterVerificationCode")}
          </p>
          <p className="my-3 text-custom-secondary">{t("CodeSentToEmail")}</p>
          <div className="my-6">
            <CountDown />
          </div>
          <Form locale={locale} />
        </BlurFade>
      </div>
      <BlurFade
        direction="right"
        inView={true}
        className={cn(
          "relative h-screen flex-[35%] overflow-hidden",
          "hidden sm:block"
        )}
      >
        <ImageHero />
      </BlurFade>
    </main>
  );
}
