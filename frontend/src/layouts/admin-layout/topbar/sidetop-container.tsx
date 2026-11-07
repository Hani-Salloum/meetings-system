"use client";

import React, { useEffect, useState } from "react";

import Cookies from "js-cookie";

import { layoutConfig } from "@/configs/layout";
import { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type TopbarType = {
  locale: Locale;
};

export default function SidebarContainer({
  locale,
  children,
}: React.PropsWithChildren<TopbarType>) {
  const widthSidebar = layoutConfig.sidebar.width;
  const trans = layoutConfig.sidebar.transition;

  const [openSidebar, setOpenSidebar] = useState(false);

  useEffect(() => {
    const updateSidebarState = () => {
      const sidebarState = Cookies.get("openSidebar") === "true";
      setOpenSidebar(sidebarState);
    };

    // Initial state from cookies
    updateSidebarState();

    // Listen for custom event
    const handleSidebarToggle = (event: CustomEvent) => {
      setOpenSidebar(event.detail);
    };

    window.addEventListener(
      "sidebarToggle",
      handleSidebarToggle as EventListener
    );

    // Cleanup
    return () => {
      window.removeEventListener(
        "sidebarToggle",
        handleSidebarToggle as EventListener
      );
    };
  }, []);

  return (
    <div
      className={cn(
        "fixed top-0 z-40 border-b-[3px] border-primary bg-white py-4",
        locale === "ar" ? "pl-10" : "pr-10"
      )}
      style={{
        left: locale === "en" ? `${openSidebar ? widthSidebar : 0}px` : "0px",
        right: locale === "en" ? "0px" : `${openSidebar ? widthSidebar : 0}px`,
        transitionProperty: "all",
        transitionDuration: `${trans.duration}s`,
        transitionBehavior: trans.ease,
      }}
    >
      {children}
    </div>
  );
}
