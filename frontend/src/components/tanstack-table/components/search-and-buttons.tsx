import { memo } from "react";

import { Icon } from "@iconify/react/dist/iconify.js";
import { Table } from "@tanstack/react-table";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TableToolbarsProps<TData> {
  table: Table<TData>;
}

const GlobalSearch = <TData,>({ table }: { table: Table<TData> }) => {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <div>
      <motion.form
        className="animate-pulse-smooth relative rounded-lg"
        onSubmit={(e) => {
          e.preventDefault();
          const input = e.currentTarget.elements.namedItem(
            "globalFilter"
          ) as HTMLInputElement;
          table.setGlobalFilter(String(input.value));
        }}
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
        whileHover={{
          scale: 1.02,
        }}
      >
        <Input
          key="All"
          name="globalFilter"
          defaultValue={table.getState().globalFilter}
          placeholder={t("Search")}
          className={cn(
            "h-12 w-full bg-card shadow-lg sm:w-48 lg:w-64",
            "focus:border-none focus:outline-none"
          )}
        />
        <Icon
          icon="icon-park-solid:enter-key"
          width="20"
          height="20"
          className={cn(
            "absolute top-1/2 flex -translate-y-1/2 items-center justify-center opacity-40",
            {
              "right-16": locale === "en",
              "left-16": locale === "ar",
            }
          )}
        />
        <Button
          type="submit"
          variant="ghost"
          className={cn("absolute top-1/2 -translate-y-1/2", {
            "left-2": locale === "ar",
            "right-2": locale === "en",
          })}
        >
          <Search className="size-1" aria-hidden="true" />
        </Button>
      </motion.form>
    </div>
  );
};

function SearchAndButtons<TData>({ table }: TableToolbarsProps<TData>) {
  return (
    <div className="w-full sm:w-auto">
      <div className="flex items-center justify-center sm:justify-end">
        <GlobalSearch<TData> table={table} />
      </div>
    </div>
  );
}

export default memo(SearchAndButtons) as typeof SearchAndButtons;
