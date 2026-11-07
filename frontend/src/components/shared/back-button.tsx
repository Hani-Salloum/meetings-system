"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Icon } from "@iconify/react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export default function BackButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations();
  const locale = useLocale();
  const showBackButton = searchParams.get("from");

  if (!showBackButton) return null;

  return (
    <Button
      variant="outline"
      className="text-md py-2 text-primary shadow-none"
      onClick={() => router.back()}
    >
      {t("Back")}
      <Icon
        icon={`${locale === "en" ? "mdi:arrow-right" : "mdi:arrow-left"}`}
      />
    </Button>
  );
}
