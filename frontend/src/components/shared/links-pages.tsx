"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/routing";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface LinksPagesProps {
  pages: {
    id?: string;
    value?: any;
    type?: "number" | "text" | "boolean";
    operator?: "eq" | "ne" | "notILik" | "iLike";
    pathname: any;
    params?: any;
    title: string;
  }[];
}
export default function LinksPages(props: LinksPagesProps) {
  const t = useTranslations();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="text-md border-primary px-2 py-1 text-primary shadow-none"
        >
          {t("Pages")}
          <Icon icon="mdi:chevron-down" className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full rounded-lg bg-purple-200 p-2 text-center">
        {props.pages.map((page: LinksPagesProps["pages"][0], _id) => (
          <DropdownMenuLabel key={_id}>
            <Button
              variant="default"
              className="text-md w-full border-primary py-2 text-white shadow-none"
            >
              <Link
                className={"flex items-center"}
                href={{
                  pathname: page.pathname,
                  ...(page.params && { params: page.params }),
                  query: {
                    ...(page.id && page.value && page.type && page.operator
                      ? {
                          filters: `[{"id":"${page.id}","value":"${page.value}","type":"${page.type}","operator":"${page.operator}","rowId":"kA6Kh0"}]`,
                          from: "back",
                        }
                      : {}),
                  },
                }}
              >
                {t(page.title)}
                <Icon icon="mdi:open-in-new" className="mx-1 h-4 w-4" />
              </Link>
            </Button>
          </DropdownMenuLabel>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
