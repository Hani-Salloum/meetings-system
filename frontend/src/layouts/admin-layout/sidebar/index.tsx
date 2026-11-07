import { Icon } from "@iconify/react/dist/iconify.js";
import { useTranslations } from "next-intl";

import { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { LinksType } from "@/types";

import { links_navigation } from "../links-navigation";
import Container from "./container";
import LinkButton from "./link-button";
import LinksGroup from "./links-group";

function Sidebar({
  locale,
  isPermitted,
}: {
  locale: Locale;
  isPermitted: (actions: string | string[]) => boolean;
}) {
  const t = useTranslations("links_navigation");

  return (
    <Container lang={locale}>
      <div className="h-full w-full overflow-hidden shadow-2xl">
        <p className="text-md px-[25px] py-[20px] font-bold text-primary">
          {t("Menu")}
        </p>
        <div
          className="h-[95vh] w-full overflow-y-auto overscroll-contain pb-4"
          style={{ scrollbarGutter: "auto" }}
        >
          {links_navigation()?.map((link: LinksType) => {
            return (
              <div key={link.id}>
                {link.urls && link.action && isPermitted(link.action) && (
                  <LinksGroup
                    id={link.id}
                    locale={locale}
                    icon={link.icon}
                    title={t(link.title)}
                    urls={link.urls?.map((url) => ({
                      ...url,
                      title: t(url.title),
                      perm: isPermitted(url.action),
                    }))}
                  />
                )}
                {!link.urls &&
                  link.action &&
                  link.url &&
                  isPermitted(link.action) && (
                    <LinkButton
                      id={link.id}
                      url={link.url}
                      locale={locale}
                      icon={link.icon}
                      title={t(link.title)}
                    />
                  )}
                {!link.urls &&
                  link.action &&
                  isPermitted(link.action) &&
                  !link.url && (
                    <div
                      key={link.id}
                      className={cn("my-1.5 flex items-center text-[#2B2A2D]")}
                    >
                      <div className="flex w-full items-center gap-3 border-b-[1px] border-custom_2-primary px-4 py-2.5">
                        <Icon
                          icon={link.icon}
                          width="24"
                          height="24"
                          className="text-primary"
                        />
                        <p className="text-[15px] font-semibold">
                          {t(link.title)}
                        </p>
                      </div>
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      </div>
    </Container>
  );
}

export default Sidebar;
