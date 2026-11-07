import type { Metadata } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";

import { NuqsAdapter } from "nuqs/adapters/next/app";

import { ConfirmDialogProvider } from "@/components/dialog";
import { Toaster as Toaster2 } from "@/components/ui/sonner";
import { Toaster as Toaster1 } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getMessages } from "@/i18n/get-messages";
import { LocaleParams } from "@/i18n/params";
import { routing } from "@/i18n/routing";

import "../globals.css";
import IntlClientProvider from "./intl-client-provider";

export const metadata: Metadata = {
  title: {
    template: "%s | Meeting Dashboard",
    default: "Meeting Dashboard",
  },
  description: "Meeting Dashboard",
  generator: "Next.js",
  keywords: ["nextjs", "next14", "pwa", "next-pwa"],
  icons: [
    { rel: "apple-touch-icon", url: "/icons/logo_sm.png" },
    { rel: "icon", url: "/icons/logo_sm.png" },
    { rel: "favicon", url: "/icons/logo_sm.png" },
  ],
};

const CairoFont = localFont({
  src: "../fonts/Cairo-Variable.ttf",
  variable: "--font-cairo",
});

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: LocaleParams;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages(locale);

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <body className={`${CairoFont.variable} antialiased`}>
        <TooltipProvider>
          <IntlClientProvider messages={messages} locale={locale}>
            <ConfirmDialogProvider>
              <NuqsAdapter>{children}</NuqsAdapter>
              <Toaster1 />
              <Toaster2
                toastOptions={{
                  classNames: {
                    loading:
                      "bg-primary text-white text-base font-bold p-4 rounded-lg shadow-lg border-none",
                    error:
                      "bg-destructive text-white text-base font-bold p-4 rounded-lg shadow-lg border-none",
                    success:
                      "bg-primary text-white text-base font-bold p-4 rounded-lg shadow-lg border-none",
                  },
                }}
              />
            </ConfirmDialogProvider>
          </IntlClientProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
