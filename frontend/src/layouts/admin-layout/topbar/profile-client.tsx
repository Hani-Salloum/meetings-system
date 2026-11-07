"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Icon } from "@iconify/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { useLocale, useTranslations } from "next-intl";

import { useUserStore } from "@/store/use-user-store";

export default function ProfileClient() {
  const { user } = useUserStore();
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const router = useRouter();
  const menu_label_classes = `flex w-full justify-between my-2  px-1 items-center ${isRTL ? "flex-row" : "flex-row-reverse"} `;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex cursor-pointer items-center gap-2">
          <div className="hidden text-end md:block">
            <p className="text-lg font-semibold text-primary">{user?.email}</p>
            <p className="text-sm text-primary opacity-90">
              {t(`user-type.${user?.user_types[0].name}`)}
            </p>
          </div>
          <div className="relative flex h-11 w-11 items-center justify-center rounded-full text-white">
            <Image
              src="/icons/logo_sm.png"
              alt="profile"
              width={100}
              height={100}
            />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="center"
        className="mt-4 flex flex-col items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-center shadow-lg dark:border-gray-700 dark:bg-gray-900"
      >
        <DropdownMenuLabel className={`${menu_label_classes} text-primary`}>
          <p className={"rounded text-sm text-primary"}>{user?.email}</p>
          <p className={"mx-1 rounded text-sm text-primary"}>{" : "}</p>
          <p className={"rounded text-sm text-primary"}>{t("email")}</p>
        </DropdownMenuLabel>
        <DropdownMenuLabel
          className={` ${menu_label_classes} hover:rounded-md hover:bg-red-50`}
        >
          <button
            onClick={() => {
              // DecorateToastV2(logoutAction(), {
              //   afterSuccess: () => {
              //     router.push(`/${locale}/auth/login`);
              //     // signOut({ callbackUrl: `/${locale}/auth/login` });
              //   },
              // });
            }}
            className={`${isRTL ? "flex-row" : "flex-row-reverse"} flex w-full cursor-pointer items-center justify-between py-1 text-red-600 transition`}
          >
            <Icon
              icon="material-symbols:logout"
              width="18"
              height="18"
              className="mx-1"
            />
            <p className="rounded text-sm">{t("Auth.Logout")}</p>
          </button>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
