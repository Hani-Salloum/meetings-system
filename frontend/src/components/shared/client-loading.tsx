import Image from "next/image";

import { useTranslations } from "next-intl";

export default function ClientLoading() {
  const t = useTranslations("Loading");
  return (
    <div className="flex min-h-[75vh] w-full flex-col items-center justify-center">
      <Image src={"/logo.png"} alt="logo" priority width={200} height={200} />
      <p className="text-xl text-secondary">{t("Loading")}</p>
    </div>
  );
}
