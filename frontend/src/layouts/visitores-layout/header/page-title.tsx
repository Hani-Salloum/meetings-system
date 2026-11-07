"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import BlurFade from "@/components/ui/blur-fade";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { GetMenuList } from "../sidebar/menu-list";

function removeLocalePrefix(pathname: string, locale: string): string {
  const cleanPath = pathname.split("?")[0].split("#")[0];
  const localePrefix = `/${locale}`;
  if (cleanPath === localePrefix) return "/";
  if (cleanPath.startsWith(`${localePrefix}/`))
    return cleanPath.slice(localePrefix.length);
  return cleanPath;
}

function findPageTitle(pathname: string, locale: string): string {
  const normalizedPathname = removeLocalePrefix(pathname, locale);
  const groups = GetMenuList();

  for (const group of groups) {
    for (const menu of group.menus ?? []) {
      if (
        menu.href &&
        (menu.href === normalizedPathname ||
          normalizedPathname.startsWith(`${menu.href}/`))
      ) {
        return menu.label;
      }

      const submenuList = (menu as any).submenus as
        | Array<{ href: string; label: string }>
        | undefined;
      if (submenuList && submenuList.length > 0) {
        for (const submenu of submenuList) {
          if (
            submenu.href &&
            (submenu.href === normalizedPathname ||
              normalizedPathname.startsWith(`${submenu.href}/`))
          ) {
            return submenu.label;
          }
        }
      }
    }
  }

  return "Dashboard";
}

type Crumb = { label: string; href?: string };

function buildBreadcrumbs(pathname: string, locale: string): Crumb[] {
  const normalizedPathname = removeLocalePrefix(pathname, locale);
  const withLocale = (path: string) => `/${locale}${path}`;
  const groups = GetMenuList();

  const breadcrumbs: Crumb[] = [];

  const homeMenu =
    groups.flatMap((g) => g.menus ?? []).find((m) => m.label === "Home") ??
    groups[0]?.menus?.[0];
  if (homeMenu?.href && homeMenu.label) {
    breadcrumbs.push({
      label: homeMenu.label,
      href: withLocale(homeMenu.href),
    });
  }

  for (const group of groups) {
    for (const menu of group.menus ?? []) {
      const matchesMenu =
        menu.href &&
        (menu.href === normalizedPathname ||
          normalizedPathname.startsWith(`${menu.href}/`));

      if (matchesMenu) {
        if (group.groupLabel) {
          breadcrumbs.push({ label: group.groupLabel });
        }

        const isExactMenu = menu.href === normalizedPathname;
        if (isExactMenu) {
          breadcrumbs.push({ label: menu.label });
          return breadcrumbs;
        }

        const submenuList = (menu as any).submenus as
          | Array<{ href: string; label: string }>
          | undefined;
        if (submenuList && submenuList.length > 0) {
          if (menu.href) {
            breadcrumbs.push({
              label: menu.label,
              href: withLocale(menu.href),
            });
          }

          for (const submenu of submenuList) {
            const matchesSubmenu =
              submenu.href &&
              (submenu.href === normalizedPathname ||
                normalizedPathname.startsWith(`${submenu.href}/`));
            if (matchesSubmenu) {
              breadcrumbs.push({ label: submenu.label });
              return breadcrumbs;
            }
          }
        }
      }
    }
  }

  breadcrumbs.push({ label: "Dashboard" });
  return breadcrumbs;
}

export default function PageTitle() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("links_navigation");

  const pageTitle = findPageTitle(pathname, locale);
  const breadcrumbs = buildBreadcrumbs(pathname, locale);

  return (
    <BlurFade inView direction="left">
      <div className="flex flex-col gap-1">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              const showSeparator = index < breadcrumbs.length - 1;
              return (
                <React.Fragment key={`${crumb.label}-${index}`}>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{t(crumb.label)}</BreadcrumbPage>
                    ) : crumb.href ? (
                      <BreadcrumbLink href={crumb.href}>
                        {t(crumb.label)}
                      </BreadcrumbLink>
                    ) : (
                      <span className="text-muted-foreground">
                        {t(crumb.label)}
                      </span>
                    )}
                  </BreadcrumbItem>
                  {showSeparator && <BreadcrumbSeparator />}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
        {/* <p className="text-base font-bold text-primary-foreground md:text-xl">
          {t(pageTitle)}
        </p> */}
      </div>
    </BlurFade>
  );
}