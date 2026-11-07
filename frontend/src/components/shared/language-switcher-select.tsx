"use client";

import { SelectValue } from "@radix-ui/react-select";
import { useParams, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Locale, routing, usePathname, useRouter } from "@/i18n/routing";

type Props = {
  defaultValue: string;
  label: string;
};

export default function LanguageSwitcherSelect({ defaultValue, label }: Props) {
  const router = useRouter();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();

  function onSelectChange(nextLocale: string) {
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
  }

  return (
    <Select defaultValue={defaultValue} onValueChange={onSelectChange}>
      <SelectTrigger
        className="h-10 w-[42px] rounded-full border border-white/30 bg-custom_2-primary text-white shadow-none focus:border-none focus:ring-0 flex items-center justify-center hover:border-custom_2-primary"
        aria-label={label}
      >
        <SelectValue>
          <span className="font-medium">
            {defaultValue.toUpperCase() === "AR" ? "AR" : "EN"}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="rounded-lg border border-white/30 bg-white/15 backdrop-blur-[12px] shadow-lg">
        {routing.locales.map((locale) => (
          <SelectItem key={locale} value={locale} className="text-white hover:bg-white/10">
            <span className="text-base font-medium transition-colors duration-200">
              {locale.toUpperCase() === "AR" ? "AR" : "EN"}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
