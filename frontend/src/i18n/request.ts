import { getRequestConfig } from "next-intl/server";

import { loadLocaleMessages } from "./load-locale-messages";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  const messages = loadLocaleMessages(locale);

  return {
    locale,
    messages,
    getMessageFallback({ key }) {
      const splitted = key.split(".");
      return splitted[splitted.length - 1];
    },
    onError(error) {
      if (error.code === "MISSING_MESSAGE") {
        return;
      } else {
        console.log(error);
      }
    },
    timeZone: "Asia/Riyadh",
  };
});
