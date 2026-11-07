import Image from "next/image";

import { getTranslations } from "next-intl/server";

import { cn } from "@/lib/utils";

async function ImageHero() {
  const t = await getTranslations("Auth");
  return (
    <>
      <div className="absolute left-1/2 top-20 z-40 h-full w-full -translate-x-1/2">
        <div className="flex flex-col items-center justify-center">
          <Image
            src={"/logo.png"}
            alt="logo"
            width={200}
            height={100}
            priority
            className="mb-3"
            style={{ objectFit: "cover", width: "auto", height: "auto" }}
          />

          <h2 className="mb-3 text-[22px] text-white md:text-[32px]">
            {t("Login")}
          </h2>
        </div>
      </div>

      <Image
        src="/auth/hero.jpeg"
        alt="hero"
        fill
        priority
        style={{ objectFit: "cover", zIndex: 1 }}
      />
      <div
        className={cn(
          "absolute left-0 top-0 z-[2] bg-primary/30",
          "h-full w-full"
        )}
      />
    </>
  );
}

export default ImageHero;
