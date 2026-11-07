"use client";

import { ReactNode } from "react";

import { useLocale } from "next-intl";

import { cn } from "@/lib/utils";
import { useSidebar } from "@/store/use-sidebar";
import { useStore } from "@/store/use-store";

function ContainerBody({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const locale = useLocale();

  const sidebar = useStore(useSidebar, (state) => state);

  if (!sidebar) return null;

  const { getOpenState, settings } = sidebar;

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-out",
        !settings.disabled &&
          (!getOpenState()
            ? locale === "ar"
              ? "lg:pr-[80px]"
              : "lg:pl-[80px]"
            : locale === "ar"
              ? "lg:pr-60"
              : "lg:pl-60"),
        className
      )}
    >
      {children}
    </div>
  );
}

export default ContainerBody;
