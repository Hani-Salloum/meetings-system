import type { LocaleParams } from "@/i18n/params";

import { RegisterProvider } from "../components/register-form";
import RegisterLayout from "../components/register-layout";
import RegisterStep2 from "../components/step2-form";

export default async function RegisterStep2Page({
  params,
}: {
  params: LocaleParams;
}) {
  const { locale } = await params;
  return (
    <RegisterProvider>
      <RegisterLayout locale={locale}>
        <RegisterStep2 locale={locale} />
      </RegisterLayout>
    </RegisterProvider>
  );
}
