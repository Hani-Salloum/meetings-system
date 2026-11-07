"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";

import { useLocale } from "next-intl";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ShinyButton from "@/components/ui/shiny-button";
import { Locale, routing, usePathname, useRouter } from "@/i18n/routing";

export default function LanguageButton({ className }: { className?: string }) {
  const router = useRouter();
  const locale = useLocale();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();

  const [open, setOpen] = useState(false);

  function onLocaleChange(nextLocale: string) {
    let _pathname = pathname;
    const search = searchParams.entries().toArray();
    if (search.length)
      _pathname += `?${search.map((e) => `${e[0]}=${e[1]}`).join("&")}`;

    router.replace(
      // @ts-expect-error -- TypeScript will validate that only known `params`
      // are used in combination with a given `pathname`. Since the two will
      // always match for the current route, we can skip runtime checks.
      { pathname: _pathname, params },
      { locale: nextLocale as Locale }
    );
    setOpen(false);
  }

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <ShinyButton className="bg-card px-4 py-2.5">
            <p className="font-bold text-primary-foreground">
              {locale.toUpperCase() === "AR" ? "AR" : "EN"}
            </p>
          </ShinyButton>
        </PopoverTrigger>
        <PopoverContent
          className="w-[120px] overflow-hidden rounded-lg border p-0 shadow-lg backdrop-blur-[12px]"
          align="end"
          sideOffset={8}
        >
          <div className="flex flex-col">
            {routing.locales.map((loc) => (
              <button
                key={loc}
                className={`w-full px-4 py-2 text-left text-base font-medium transition-colors duration-200 hover:bg-muted ${
                  locale === loc ? "bg-muted" : ""
                }`}
                onClick={() => onLocaleChange(loc)}
                type="button"
                aria-current={locale === loc}
              >
                {loc.toUpperCase() === "AR" ? "AR" : "EN"}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
