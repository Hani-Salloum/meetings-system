import type { LocaleParams } from "@/i18n/params";

import { RegisterProvider } from "./components/register-form";
import RegisterLayout from "./components/register-layout";
import RegisterStep1 from "./components/step1-form";

export default async function RegisterStep1Page({
  params,
}: {
  params: LocaleParams;
}) {
  const { locale } = await params;
  return (
    <RegisterProvider>
      <RegisterLayout locale={locale}>
        <RegisterStep1 locale={locale} />
      </RegisterLayout>
    </RegisterProvider>
  );
}
