"use client";

import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Icon } from "@iconify/react/dist/iconify.js";
import { Bell, LayoutGrid, LogOut, Settings, User } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ShinyButton from "@/components/ui/shiny-button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { auth } from "@/configs/api";
import { Link, Locale, usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/use-user-store";

export function UserNav() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  const { user } = useUserStore()
  const [open, setOpen] = useState(false);

  const t = useTranslations();

  function onLocaleChange(nextLocale: string) {
    let _pathname = pathname;
    const search = searchParams.entries().toArray();
    if (search.length)
      _pathname += `?${search.map((e) => `${e[0]}=${e[1]}`).join("&")}`;

    router.replace(
      // @ts-expect-error -- TypeScript will validate that only known `params`
      // are used in combination with a given `pathname`. Since the two will
      // always match for the current route, we can skip runtime checks.
      { pathname: _pathname, params },
      { locale: nextLocale as Locale }
    );
    setOpen(false);
  }
  return (
    <DropdownMenu modal dir={locale === "ar" ? "rtl" : "ltr"}>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"} className="group h-12">
                <section className="flex items-center justify-between group-[.is-collapsed]:justify-center">
                  <div
                    className={cn(
                      "flex items-center justify-center gap-2",
                      "group-[.is-collapsed]:hidden"
                    )}
                  >
                    <div className="flex flex-col items-end gap-2">
                      <p className="text-sm font-bold leading-[100%]">
                        { user?.first_name + " " + user?.last_name}
                      </p>
                      <p className="text-xs font-normal leading-[100%] capitalize">
                        {t(user?.user_types[0].name)}
                      </p>
                    </div>
                    <div className="h-full w-full rounded-[8px] bg-gray-300 p-2">
                      <Image
                        src={"/icons/ic_user.png"}
                        alt="User Avatar"
                        width={25}
                        height={25}
                        style={{ objectFit: "cover" }}
                        priority
                      />
                    </div>
                  </div>
                </section>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">{t("Profile")}</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="mb-2 text-base font-medium leading-none">
            { user?.first_name + " " + user?.last_name}
            </p>
            <p className="text-sm leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Mobile Only Controls */}
        <div className="block sm:hidden">
          <DropdownMenuGroup>
            {/* <DropdownMenuItem className="hover:cursor-pointer" asChild>
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <Bell className="mx-3 h-4 w-4 text-muted-foreground" />
                  {t("Notifications")}
                </div>
                <ShinyButton className="bg-card px-2 py-1">
                  <Icon
                    icon="mingcute:notification-newdot-line"
                    width="16"
                    height="16"
                    className="font-bold text-primary-foreground"
                  />
                </ShinyButton>
              </div>
            </DropdownMenuItem> */}
            <DropdownMenuItem className="hover:cursor-pointer">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <Settings className="mx-3 h-4 w-4 text-muted-foreground" />
                  {t("Theme")}
                </div>
                <AnimatedThemeToggler className="rounded-lg bg-card px-2 py-1" />
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:cursor-pointer">
              <div
                onClick={() => onLocaleChange(locale === "ar" ? "en" : "ar")}
                className="flex w-full items-center justify-between"
              >
                <div className="flex items-center">
                  <Icon
                    icon="mdi:translate"
                    className="mx-3 h-4 w-4 text-muted-foreground"
                  />
                  {t("Language")}
                </div>
                <ShinyButton className="bg-card px-2 py-1">
                  <p className="font-bold text-primary-foreground">
                    {locale.toUpperCase() === "AR" ? "AR" : "EN"}
                  </p>
                </ShinyButton>
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
        </div>

        {/* <DropdownMenuGroup>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Link href="/" className="flex items-center">
              <LayoutGrid className="mr-3 h-4 w-4 text-muted-foreground" />
              {t("Dashboard")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Link href={{ pathname: "/profile" }} className="flex items-center">
              <User className="mr-3 h-4 w-4 text-muted-foreground" />
              {t("Account")}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup> */}
        {/* <DropdownMenuSeparator /> */}
        <DropdownMenuItem
          className="text-destructive hover:cursor-pointer"
          onClick={() => {
            localStorage.removeItem(auth.admin);
            router.push('/auth/login')
          }}
        >
          <LogOut className="mr-3 h-4 w-4" />
          {t("SignOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
