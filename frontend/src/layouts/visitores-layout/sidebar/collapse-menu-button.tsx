"use client";

import { useState } from "react";

import { Icon } from "@iconify/react/dist/iconify.js";
import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Dot } from "lucide-react";
import { useTranslations } from "next-intl";

import ProgressLink from "@/components/shared/progress-link";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

interface CollapseMenuButtonProps {
  icon: string;
  label: string;
  active: boolean;
  submenus: Submenu[];
  isOpen: boolean | undefined;
}

export function CollapseMenuButton({
  icon,
  label,
  active,
  submenus,
  isOpen,
}: CollapseMenuButtonProps) {
  console.log(active);

  const pathname = usePathname();
  const t = useTranslations("links_navigation");
  const isSubmenuActive = submenus.some((submenu) =>
    submenu.active === undefined ? submenu.href === pathname : submenu.active
  );
  const [isCollapsed, setIsCollapsed] = useState<boolean>(isSubmenuActive);

  return isOpen ? (
    <Collapsible
      open={isCollapsed}
      onOpenChange={setIsCollapsed}
      className="w-full"
    >
      <CollapsibleTrigger
        className="mb-1 [&[data-state=open]>div>div>svg]:rotate-180"
        asChild
      >
        <Button
        variant={"ghost"}
          className={cn(
            "h-12 w-full justify-start",
            "flex items-center justify-center",
            isSubmenuActive && "text-primary-foreground bg-primary shadow-md",
            !isSubmenuActive && "text-muted-foreground/70",
          )}
        >
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center text-base justify-center gap-3">
              <div className={"mr-2"}>
                <Icon icon={icon} className="min-h-[25px] min-w-[25px]" />
              </div>
              <p
                className={cn(
                  "max-w-[150px] truncate",
                  isOpen
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-96 opacity-0"
                )}
              >
                {t(label)}
              </p>
            </div>
            <div
              className={cn(
                "whitespace-nowrap",
                isOpen
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-96 opacity-0"
              )}
            >
              <ChevronDown
                size={32}
                className="transition-transform duration-200"
              />
            </div>
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        {submenus.map(({ href, label, active }, index) => (
          <Button
            key={index}
            variant={
              (active === undefined && pathname === href) || active
                ? "secondary"
                : "ghost"
            }
            className={cn(
              "mb-1 h-10 w-full justify-start ",
              pathname.startsWith(href) ? "text-foreground" : ""
            )}
            asChild
          >
            <ProgressLink href={href as any}>
              <span className="ml-2 mr-2">
                <Dot size={32} />
              </span>
              <p
                className={cn(
                  "max-w-[170px] truncate",
                  isOpen
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-96 opacity-0"
                )}
              >
                {t(label)}
              </p>
            </ProgressLink>
          </Button>
        ))}
      </CollapsibleContent>
    </Collapsible>
  ) : (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant={isSubmenuActive ? "secondary" : "ghost"}
                className="mb-1 flex h-10 w-full items-center justify-center "
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex h-full w-full items-center justify-center">
                    <div
                      className={cn(
                        "flex h-full w-full items-center justify-center"
                      )}
                    >
                      <Icon icon={icon} className="min-h-[25px] min-w-[25px]" />
                    </div>
                    <p
                      className={cn(
                        "max-w-[200px] truncate",
                        isOpen === false ? "opacity-0" : "opacity-100"
                      )}
                    >
                      {t(label)}
                    </p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right" align="start" alignOffset={2}>
            {t(label)}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent side="right" sideOffset={25} align="start">
        <DropdownMenuLabel className="max-w-[190px] truncate">
          {t(label)}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {submenus.map(({ href, label, active }, index) => (
          <DropdownMenuItem key={index} asChild>
            <ProgressLink
              className={`cursor-pointer ${
                ((active === undefined && pathname === href) || active) &&
                "bg-secondary"
              }`}
              href={href as any}
            >
              <p className="max-w-[180px] truncate">{t(label)}</p>
            </ProgressLink>
          </DropdownMenuItem>
        ))}
        <DropdownMenuArrow className="fill-border" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
