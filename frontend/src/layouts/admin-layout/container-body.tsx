"use client";

import { ReactNode, useEffect, useState } from "react";

import Cookies from "js-cookie";

import { cn } from "@/components/table/lib/utils-table";
import { LayoutConfig, layoutConfig } from "@/configs/layout";
import { Locale } from "@/i18n/routing";

type widthSidebarType = LayoutConfig["sidebar"]["width"];
type transitionSidebarType = LayoutConfig["sidebar"]["transition"];

function ContainerBody({
  className,
  children,
  lang,
}: {
  className?: string;
  children: ReactNode;
  lang: Locale;
}) {
  const widthSidebar: widthSidebarType = layoutConfig.sidebar.width;
  const transitionSidebar: transitionSidebarType =
    layoutConfig.sidebar.transition;

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
      className={cn("min-h-screen w-full", className)}
      style={{
        transitionProperty: "all",
        transitionDuration: `${transitionSidebar.duration}s`,
        transitionBehavior: transitionSidebar.ease,
        paddingRight: openSidebar && lang === "ar" ? `${widthSidebar}px` : 0,
        paddingLeft: openSidebar && lang === "en" ? `${widthSidebar}px` : 0,
      }}
    >
      {children}
    </div>
  );
}

export default ContainerBody;
