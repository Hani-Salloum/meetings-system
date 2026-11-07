"use client";

import { useState } from "react";

import { Icon } from "@iconify/react/dist/iconify.js";
import { ChevronRight, Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import ProgressLink from "@/components/shared/progress-link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ValidHref, usePathname } from "@/i18n/routing";
import { GetMenuList } from "@/layouts/visitores-layout/sidebar/menu-list";
import { cn } from "@/lib/utils";
import { Layout } from "@/types/layout";

interface BottomNavigationBarProps {
  className?: string;
}

const mainNavigationItems = [
  {
    icon: "fluent:home-more-32-filled",
    label: "Home",
    href: "/dashboard",
    color: "text-blue-500",
  },
  {
    href: "/dashboard/meetings",
    label: "Your Meetings",
    icon: "streamline-ultimate:team-meeting",
    color: "text-orange-500",
  },
  {
    href: "/dashboard/meeting-requests",
    label: "Your Meeting Requests",
    icon: "hugeicons:question",
    color: "text-green-500",
  },
  // {
  //   icon: "icon-park-outline:ticket",
  //   label: "Match Tickets",
  //   href: "/guest-dashboard/match-tickets",
  //   color: "text-green-500",
  // },
  // {
  //   icon: "mdi:flight-takeoff",
  //   label: "Travel Tickets",
  //   href: "/guest-dashboard/travel-tickets",
  //   color: "text-orange-500",
  // },
  // {
  //   icon: "fluent:calendar-todo-32-light",
  //   label: "Hotel Booking",
  //   href: "/visitors-dashboard",
  //   color: "text-purple-500",
  // },
];

export default function BottomNavigationBar({
  className,
}: BottomNavigationBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<Layout.Menu | null>(null);
  const locale = useLocale();
  const t = useTranslations("links_navigation");
  const tGlobal = useTranslations();
  const pathname = usePathname();
  const menuList = GetMenuList();

  const handleMenuClick = (menu: Layout.Menu) => {
    if (menu.submenus && menu.submenus.length > 0) {
      setSelectedMenu(menu);
    } else {
      setIsOpen(false);
      setSelectedMenu(null);
    }
  };

  const handleBack = () => {
    setSelectedMenu(null);
  };

  const renderMenuItems = (menus: Layout.Menu[]) => {
    return menus.map((menu, index) => {
      const isActive = menu.href && pathname === menu.href;

      return (
        <div
          key={index}
          className={cn(
            "group mb-4 flex cursor-pointer items-center justify-between rounded-2xl p-2 transition-all duration-300",
            isActive
              ? "border border-primary-foreground/20 bg-primary-foreground/10"
              : "border border-transparent bg-muted/50 hover:border-primary/20 hover:bg-muted/80",
            "hover:scale-105 hover:shadow-lg hover:shadow-primary/10"
          )}
          onClick={() => handleMenuClick(menu)}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "rounded-xl p-3 transition-all duration-300",
                isActive
                  ? "bg-primary/20"
                  : "bg-background/80 group-hover:bg-background/60",
                "group-hover:scale-110 group-hover:shadow-md"
              )}
            >
              <Icon
                icon={menu.icon}
                className={cn(
                  "h-6 w-6",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-foreground/80 transition-colors group-hover:text-foreground">
                {t(menu.label)}
              </span>
              {menu.actions && menu.actions.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  {menu.actions.join(", ")}
                </span>
              )}
            </div>
          </div>
          {menu.submenus && menu.submenus.length > 0 && (
            <ChevronRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground" />
          )}
        </div>
      );
    });
  };

  return (
    <>
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 block sm:hidden",
          className
        )}
      >
        <div className="mx-2 mb-2 rounded-2xl border border-border/50 bg-background/80 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-around p-2">
            {mainNavigationItems.map((item, index) => {
              return (
                <ProgressLink
                  key={index}
                  href={item.href as ValidHref}
                  className="group flex flex-col items-center justify-center gap-1 rounded-xl p-2 transition-all duration-300 hover:bg-primary/10"
                >
                  <Icon
                    icon={item.icon}
                    className={cn(
                      "h-5 w-5 transition-all duration-300",
                      item.color,
                      "group-hover:scale-110"
                    )}
                  />
                  <span className="text-center text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                    {t(item.label)}
                  </span>
                </ProgressLink>
              );
            })}

            {/* Center Menu Button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button className="relative h-14 w-14 rounded-full bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30">
                  <Plus className="h-6 w-6" />
                  <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-white/20 to-transparent" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="rounded-t-3xl border-t-2 border-primary/20 bg-gradient-to-b from-background to-background/95 backdrop-blur-xl"
              >
                <SheetHeader className="sr-only">
                  <SheetTitle>
                    {selectedMenu
                      ? t(selectedMenu.label)
                      : tGlobal("Main Menu")}
                  </SheetTitle>
                </SheetHeader>
                <ScrollArea
                  className="h-[70vh]"
                  dir={locale === "ar" ? "rtl" : "ltr"}
                >
                  <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between border-b border-border/50 p-4">
                      <div className="flex items-center gap-3">
                        {selectedMenu && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleBack}
                            className="h-8 w-8 rounded-full hover:bg-primary/10"
                          >
                            <ChevronRight className="h-4 w-4 rotate-180" />
                          </Button>
                        )}
                        <h2 className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-xl font-bold text-primary-foreground">
                          {selectedMenu
                            ? t(selectedMenu.label)
                            : tGlobal("Main Menu")}
                        </h2>
                      </div>
                      <div className="h-1 w-12 rounded-full bg-primary/50" />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col space-x-3">
                        {selectedMenu
                          ? selectedMenu.submenus?.map((submenu, index) => (
                              <ProgressLink
                                key={index}
                                href={submenu.href as ValidHref}
                                onClick={() => {
                                  setIsOpen(false);
                                  setSelectedMenu(null);
                                }}
                              >
                                <div className="group mb-3 flex cursor-pointer items-center gap-3 rounded-2xl border border-transparent bg-muted/50 p-4 transition-all duration-300 hover:scale-105 hover:border-primary/20 hover:bg-muted/80 hover:shadow-lg hover:shadow-primary/10">
                                  <div className="rounded-xl bg-background/80 p-3 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                                    <Icon
                                      icon="mdi:chevron-right"
                                      className="h-5 w-5 text-muted-foreground group-hover:text-foreground"
                                    />
                                  </div>
                                  <span className="font-medium text-foreground/80 transition-colors group-hover:text-foreground">
                                    {t(submenu.label)}
                                  </span>
                                </div>
                              </ProgressLink>
                            ))
                          : menuList.map((group, groupIndex) => (
                              <div key={groupIndex}>
                                {group.groupLabel && (
                                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                    {t(group.groupLabel)}
                                  </h3>
                                )}
                                {renderMenuItems(group.menus)}
                              </div>
                            ))}
                      </div>
                    </div>

                    <div className="border-t border-border/50 p-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                          {selectedMenu
                            ? tGlobal("Back to main menu")
                            : tGlobal("Pull down to close")}
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="block h-20 sm:hidden" />
    </>
  );
}
