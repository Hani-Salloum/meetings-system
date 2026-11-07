import type { LocaleParams } from "@/i18n/params";

import { RegisterProvider } from "../components/register-form";
import RegisterLayout from "../components/register-layout";
import RegisterStep3 from "../components/step3-form";

export default async function RegisterStep3Page({
  params,
}: {
  params: LocaleParams;
}) {
  const { locale } = await params;
  return (
    <RegisterProvider>
      <RegisterLayout locale={locale}>
        <RegisterStep3 locale={locale} />
      </RegisterLayout>
    </RegisterProvider>
  );
}
