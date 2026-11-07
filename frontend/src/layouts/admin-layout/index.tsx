"use client";

import { ConfirmDialogProvider } from "@/components/dialog/context/confirm-dialog-context";
import { Locale } from "@/i18n/routing";
import { useUserStore } from "@/store/use-user-store";

import ContainerBody from "./container-body";
import Sidebar from "./sidebar";
import Topbar from "./topbar";

export default function AdminLayout({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  const { isPermitted } = useUserStore();
  return (
    <ConfirmDialogProvider>
      <main className="">
        <div className="flex items-start bg-[#fbfafc]">
          <Sidebar locale={locale} isPermitted={isPermitted} />
          <ContainerBody lang={locale} className="flex-1">
            <Topbar locale={locale} />
            <div className="mt-28 w-full p-4 md:p-8">{children}</div>
          </ContainerBody>
        </div>
      </main>
    </ConfirmDialogProvider>
  );
}
