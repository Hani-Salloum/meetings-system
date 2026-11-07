"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "next-intl";

import { cn } from "@/lib/utils";
import { useSidebar } from "@/store/use-sidebar";
import { useStore } from "@/store/use-store";

import LogoImage from "../logo-image";
import MenuLinks from "./menu-links";
import { SidebarToggle } from "./sidebar-toggle";

function Sidebar() {
  const locale = useLocale();

  const sidebar = useStore(useSidebar, (state) => state);

  if (!sidebar) return null;

  const { isOpen, toggleOpen, getOpenState, settings } = sidebar;

  return (
    <aside
      className={cn(
        "fixed top-0 z-20 h-screen -translate-x-[300000px] py-6 lg:translate-x-0",
        "transition-all duration-300 ease-in-out",
        !getOpenState() ? "w-[70px]" : "w-60",
        settings.disabled && "hidden",
        locale === "ar" ? "right-0" : "left-0"
      )}
    >
      <div
        className={cn(
          "relative flex h-full flex-col gap-4 px-1",
          locale === "ar" ? "border-l-2" : "border-r-2"
        )}
      >
        <div className="relative flex w-full items-center justify-center gap-3">
          <SidebarToggle isOpen={isOpen} setIsOpen={toggleOpen} />
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="logo-image"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                style={{ originX: 0.5, originY: 0.5 }}
              >
                <LogoImage
                  width={150}
                  height={100}
                  className="hidden h-auto sm:block"
                  priority
                  href="/"
                />
              </motion.div>
            ) : (
              <motion.div
                key="logo-text"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="flex w-full items-center justify-center"
              >
                <p className="text-center font-bold text-primary-foreground">
                  {"Logo"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <MenuLinks />
      </div>
    </aside>
  );
}

export default Sidebar;
