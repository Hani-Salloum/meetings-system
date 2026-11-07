import { Icon } from "@iconify/react/dist/iconify.js";
import { Ellipsis } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import ProgressLink from "@/components/shared/progress-link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ValidHref, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/store/use-sidebar";
import { Layout } from "@/types/layout";

import { CollapseMenuButton } from "./collapse-menu-button";
import { GetMenuList } from "./menu-list";
import { useUserStore } from "@/store/use-user-store";

function MenuLinks() {
  const locale = useLocale();
  const t = useTranslations("links_navigation");
  const pathname = usePathname();
  const menuList = GetMenuList();

  const { isOpen } = useSidebar();

  const renderGroupLabel = (groupLabel: string) => {
    if (isOpen === undefined || isOpen) {
      return (
        <p className="truncate px-4 pb-2 text-sm font-medium">
          {t(groupLabel)}
        </p>
      );
    }
    if (!isOpen && groupLabel) {
      return (
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger className="w-full">
              <div className="flex w-full items-center justify-center">
                <Ellipsis className="h-5 w-5" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="">{t(groupLabel)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return <p className="pb-2" />;
  };

  const renderMenuItem = (
    { href, label, icon, active, submenus, actions }: Layout.Menu,
    index: number
  ) => {
    const isActive = active ?? pathname === href;
    const { hasAllPerm } = useUserStore()

    const buttonClasses = cn(
      "h-12 w-full justify-start text-lg font-semibold mb-1",
      isActive && "bg-primary text-primary-foreground font-bold",
      !isActive && "text-muted-foreground/70",
      !isOpen && "flex items-center justify-center"
    );

    if(!hasAllPerm(actions || [])) {
      return null
    }

    if (!submenus?.length) {
      return (
        <TooltipProvider key={index}>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <Button variant={"ghost"} className={buttonClasses}>
                <ProgressLink
                  href={href as ValidHref}
                  className={cn("flex w-full items-center gap-3", {
                    // "justify-center": !isOpen,
                    "justify-start": isOpen,
                  })}
                >
                  <Icon
                    icon={icon}
                    className={cn(
                      "min-h-[25px] min-w-[25px]",
                      isOpen !== false && "mr-2"
                    )}
                  />
                  <p
                    className={cn(
                      "truncate text-base transition-all",
                      !isOpen ? "hidden opacity-0" : "opacity-100"
                    )}
                  >
                    {t(label)}
                  </p>
                </ProgressLink>
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className={cn("z-50", {
                hidden: isOpen,
              })}
            >
              <p className="">{t(label)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <CollapseMenuButton
        key={index}
        icon={icon}
        label={label}
        active={isActive}
        submenus={submenus}
        isOpen={isOpen}
      />
    );
  };

  return (
    <ScrollArea className="h-[90vh] md:h-[90vh] [&>div>div[style]]:!block">
      <nav className="h-full w-full" dir={locale === "ar" ? "rtl" : "ltr"}>
        <ul className="flex flex-col items-start space-y-2">
          {menuList.map(({ groupLabel, menus }, index) => (
            <li key={index} className={cn("w-full", groupLabel && "pt-3")}>
              {renderGroupLabel(groupLabel)}

              {menus.map(renderMenuItem)}
            </li>
          ))}
        </ul>
      </nav>
    </ScrollArea>
  );
}

export default MenuLinks;
