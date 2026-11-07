"use client";

import { PropsWithChildren } from "react";

import { NextIntlClientProvider } from "next-intl";

const IntlClientProvider = ({
  messages,
  locale,
  children,
}: PropsWithChildren & {
  messages: any;
  locale: any;
}) => {
  return (
    <NextIntlClientProvider
      messages={messages}
      locale={locale}
      // Prevents console errors for missing keys
      onError={(error) => {
        if (error.code === "MISSING_MESSAGE") {
          return;
        } else {
          console.log(error);
        }
      }}
      // return the translation key if not exist
      getMessageFallback={({ key }) => {
        if (!key) return "";
        const splitted = key.split(".");
        return splitted[splitted.length - 1];
      }}
    >
      {children}
    </NextIntlClientProvider>
  );
};

export default IntlClientProvider;
