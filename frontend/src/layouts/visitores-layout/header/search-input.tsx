"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function SearchInput({ className }: { className?: string }) {
  const t = useTranslations();

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg bg-card px-5 py-2 text-card-foreground shadow-[0px_20px_50px_0px_#BF156C0D]",
        className
      )}
    >
      <motion.div
        whileHover={{ scale: 1.2, rotate: 15 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="flex cursor-pointer items-center"
      >
        <Icon
          icon="line-md:search-twotone"
          width="24"
          height="24"
          className="text-primary-foreground"
        />
      </motion.div>
      <div className="relative w-full">
        <Input
          type="text"
          placeholder={t("Search")}
          className="text-muted-foreground shadow-none outline-none focus-visible:outline-none focus-visible:ring-0"
        />
      </div>
    </div>
  );
}

export default SearchInput;
