"use client";

import { useState } from "react";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

import { Link, Locale, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type LinksGroupType = {
  locale: Locale;
  icon: string;
  id: string;
  title: string;
  urls: {
    id: string;
    title: string;
    url: string;
    perm: boolean;
  }[];
};

const menuVariants = {
  open: {
    height: "auto",
    opacity: 1,
    transition: { duration: 0.4, ease: "easeInOut" },
  },
  closed: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

function LinksGroup({ id, locale, icon, title, urls }: LinksGroupType) {
  const currentRoute = usePathname();

  const [openMenu, setOpenMenu] = useState<boolean>(
    urls?.some((url) => currentRoute?.startsWith(url?.url)) ?? false
  );

  return (
    <div key={id}>
      <button
        onClick={() => setOpenMenu((prev) => !prev)}
        className={cn(
          "my-1 flex items-center justify-between rounded-r-md py-2.5 text-[#2B2A2D]",
          locale === "ar" &&
            "hover:bg-[linear-gradient(89.97deg,#8355A0_0.01%,#8355a05d_99.96%)]",
          locale === "en" &&
            "hover:bg-[linear-gradient(269.97deg,#8355A0_0.01%,#323940_99.96%)]",
          "group transition-all duration-500 hover:text-white",
          "w-full border-custom_2-primary",
          {
            "rounded-r-md pl-10 pr-4 hover:border-r-8": locale == "ar",
            "rounded-l-md pl-4 pr-10 hover:border-l-8": locale == "en",
          }
        )}
      >
        <div className="flex items-center gap-3">
          <Icon
            icon={icon}
            width="24"
            height="24"
            className="text-primary group-hover:text-white"
          />
          <p className="text-[15px] font-semibold">{title}</p>
        </div>
        <Icon
          icon="bxs:down-arrow"
          width="10"
          height="10"
          className={cn(
            "text-primary transition-all duration-500 group-hover:text-white",
            openMenu
              ? "rotate-0"
              : {
                  "-rotate-90": locale === "ar",
                  "rotate-90": locale === "en",
                }
          )}
        />
      </button>
      <motion.ul
        initial="closed"
        animate={openMenu ? "open" : "closed"}
        variants={menuVariants}
        className="overflow-hidden"
      >
        {urls?.map(
          (link) =>
            link.perm && (
              <li key={link.id}>
                <Link
                  key={link.id}
                  href={{
                    pathname: link.url as any,
                  }}
                  className={cn(
                    "mb-0.5 flex items-center gap-3 py-2.5 text-[#2B2A2D]",
                    locale === "ar" &&
                      "hover:bg-[linear-gradient(89.97deg,#8355A0_0.01%,#8355a05d_99.96%)]",
                    locale === "en" &&
                      "hover:bg-[linear-gradient(269.97deg,#8355A0_0.01%,#323940_99.96%)]",
                    "transition-all duration-500 hover:text-white",
                    "border-custom_2-primary",
                    {
                      "rounded-r-md pr-12 hover:border-r-8": locale === "ar",
                      "rounded-l-md pl-12 hover:border-l-8": locale === "en",
                    },
                    {
                      "border-r-8 bg-[linear-gradient(89.97deg,#8355A0_0.01%,#8355a05d_99.96%)] text-white":
                        currentRoute === link.url && locale === "ar",
                      "border-l-8 bg-[linear-gradient(269.97deg,#8355A0_0.01%,#323940_99.96%)] text-white":
                        currentRoute === link.url && locale === "en",
                    }
                  )}
                >
                  <p className="text-sm font-normal">{link.title}</p>
                </Link>
              </li>
            )
        )}
      </motion.ul>
    </div>
  );
}

export default LinksGroup;
