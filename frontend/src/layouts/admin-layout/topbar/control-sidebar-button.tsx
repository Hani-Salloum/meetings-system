"use client";

import React, { useEffect, useState } from "react";

import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";
import Cookies from "js-cookie";

function ControlSidebarButton() {
  const [openSidebar, setOpenSidebar] = useState(false);

  useEffect(() => {
    // Get the initial state from cookies
    const sidebarState = Cookies.get("openSidebar") === "true";
    setOpenSidebar(sidebarState);
  }, []);

  const toggleSidebar = () => {
    const newSidebarState = !openSidebar;
    setOpenSidebar(newSidebarState);
    Cookies.set("openSidebar", newSidebarState.toString());

    // Dispatch custom event
    const event = new CustomEvent("sidebarToggle", { detail: newSidebarState });
    window.dispatchEvent(event);
  };

  return (
    <motion.button
      onClick={toggleSidebar}
      className="rounded-md p-2 text-primary"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        animate={{ rotate: openSidebar ? 180 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Icon
          icon="line-md:close-to-menu-transition"
          width="24"
          height="24"
          className="text-primary"
        />
      </motion.div>
    </motion.button>
  );
}

export default ControlSidebarButton;
