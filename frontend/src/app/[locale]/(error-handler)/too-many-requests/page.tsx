"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export default function NotAuthorized() {
  // لو ما عندك ترجمة في client تقدر تحط النص مباشرة
  // أو تجيب الترجمة بطريقة مناسبة client-side
  const t = (key: string) => {
    const translations: Record<string, string> = {
      "Too many requests": "Too many requests",
      "Return to home": "Return to home",
    };
    return translations[key] || key;
  };

  const [disabled, setDisabled] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    if (!disabled) return; // إذا مش معطل ما نحتاج المؤقت

    const interval = setInterval(() => {
      setSecondsLeft((sec) => {
        if (sec <= 1) {
          clearInterval(interval);
          setDisabled(false);
          return 0;
        }
        return sec - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [disabled]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-primary">
      <div className="rounded-full bg-primary-foreground p-16 text-center">
        <h1 className="text-8xl font-bold text-primary md:text-[150px]">429</h1>
        <p className="mt-8 text-lg text-primary">{t("Too many requests")}</p>
        <div className="mt-4">
          <Button variant="default" size="lg" disabled={disabled}>
            <Link href="/dashboard">
              {disabled
                ? `${t("Return to home")} (${secondsLeft})`
                : t("Return to home")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
