"use client";

import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useLocale } from "next-intl";

interface SidebarToggleProps {
  isOpen?: boolean;
  setIsOpen?: () => void;
}

export function SidebarToggle({ isOpen = false, setIsOpen }: SidebarToggleProps) {
  const locale = useLocale();

  const getPositionClass = () => {
    if (locale === "ar") {
      return isOpen ? "-left-6" : "-left-8";
    }
    return isOpen ? "-right-6" : "-right-8";
  };

  const getIconName = () => {
    if (locale === "ar") {
      return isOpen ? "mdi:menu-right" : "mdi:menu-left";
    }
    return isOpen ? "mdi:menu-left" : "mdi:menu-right";
  };

  return (
    <div
      onClick={setIsOpen}
      className={cn(
        "absolute top-0 w-[45px] h-[45px] flex items-center justify-center cursor-pointer rounded-full shadow-none z-20 bg-white/15",
        getPositionClass()
      )}
    >
      <Icon
        icon={getIconName()}
        className="text-gray-200"
        width={45}
        height={45}
      />
      {/*
      <Image
        src={"/icons/receive-square.png"}
        alt="Toggle Sidebar"
        width={24}
        height={24}
        style={{ objectFit: "cover" }}
        priority
        className={!isOpen ? "" : "rotate-180"}
      />
      */}
    </div>
  );
}
