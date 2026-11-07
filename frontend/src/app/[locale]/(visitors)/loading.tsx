import Image from "next/image";

import { getTranslations } from "next-intl/server";

async function loading() {
  const t = await getTranslations();

  return (
    <div className="flex min-h-[75vh] w-full flex-col items-center justify-center">
      <Image src={"/logo.png"} alt="logo" priority width={200} height={200} />
      <p className="text-xl text-secondary">{t("Loading")}</p>
    </div>
  );
}

export default loading;
