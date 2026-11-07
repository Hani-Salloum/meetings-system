"use server";

import { loadLocaleMessages } from "@/i18n/load-locale-messages";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";

export async function getMessages(locale: Locale) {
  if (!routing.locales.includes(locale)) {
    locale = routing.defaultLocale;
  }

  return loadLocaleMessages(locale);
}
