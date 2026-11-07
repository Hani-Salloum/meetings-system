import { headers } from "next/headers";

import { getTranslations } from "next-intl/server";

import BlurFade from "@/components/ui/blur-fade";

import { links_navigation } from "../links-navigation";

function findPageTitle(pathname: string): string {
  const links = links_navigation();

  const match = links.find(
    (link) =>
      link.url === pathname ||
      link.urls?.some((subLink) => subLink.url === pathname)
  );

  return match ? match.title : "Dashboard";
}

export default async function PageTitle({ locale }: { locale: "ar" | "en" }) {
  const headersList = await headers();

  const t = await getTranslations();

  const pathname = headersList.get("next-url") || `/${locale}`;

  const pageTitle = findPageTitle(pathname);

  return (
    <BlurFade inView direction="left">
      <p className="text-base font-semibold text-primary md:text-lg">
        {t(pageTitle)}
      </p>
    </BlurFade>
  );
}
