import type { Metadata } from "next";
import { notFound } from "next/navigation";

import AuthGuard from "@/components/guards/auth-guard";
import { LocaleParams } from "@/i18n/params";
import { routing } from "@/i18n/routing";
import AdminLayout from "@/layouts/admin-layout";

export const metadata: Metadata = {
  description: "getN",
  generator: "Next.js",
  keywords: ["nextjs", "next14", "pwa", "next-pwa"],
  icons: [
    { rel: "apple-touch-icon", url: "/icons/logo_sm.png" },
    { rel: "icon", url: "/icons/logo_sm.png" },
    { rel: "favicon", url: "/icons/logo_sm.png" },
  ],
};

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

  return (
    <AuthGuard>
      <AdminLayout locale={locale}>{children}</AdminLayout>
    </AuthGuard>
  );
}
