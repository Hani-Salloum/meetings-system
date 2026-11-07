"use client";

import { useEffect, useState } from "react";

import Cookies from "js-cookie";

import { LayoutConfig, layoutConfig } from "@/configs/layout";
import useWindowSize from "@/hooks/use-window-size";
import { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import ControlSidebarButton from "../topbar/control-sidebar-button";

type widthSidebarType = LayoutConfig["sidebar"]["width"];
type transitionSidebarType = LayoutConfig["sidebar"]["transition"];

function Container({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: Locale;
}) {
  const { cs } = useWindowSize();
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

  if (cs == "md")
    return (
      <div
        className={cn(
          "z-50 flex flex-col items-center overflow-hidden",
          "min-h-screen",
          "bg-white ",
          "fixed top-0",
          {
            "left-0": lang === "en",
            "right-0": lang === "ar",
          }
        )}
        style={{
          transitionProperty: "all",
          transitionDuration: `${transitionSidebar.duration}s`,
          transitionBehavior: transitionSidebar.ease,
          width: openSidebar ? "100vw" : 0,
        }}
      >
        <div className="w-full text-end">
          <ControlSidebarButton />
        </div>
        <div className="flex flex-col items-center" style={{ width: "100vw" }}>
          {children}
        </div>
      </div>
    );

  return (
    <div
      className={cn(
        "flex flex-col items-center overflow-hidden",
        "z-50 scroll-m-6 shadow-2xl",
        "min-h-screen",
        "bg-white ",
        "fixed top-0",
        {
          "left-0": lang === "en",
          "right-0": lang === "ar",
        }
      )}
      style={{
        transitionProperty: "all",
        transitionDuration: `${transitionSidebar.duration}s`,
        transitionBehavior: transitionSidebar.ease,
        width: openSidebar ? `${widthSidebar}px` : 0,
      }}
    >
      <div
        className="flex flex-col items-center"
        style={{ width: `${widthSidebar}px` }}
      >
        {children}
      </div>
    </div>
  );
}

export default Container;
