import { memo } from "react";

import { Table } from "@tanstack/react-table";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

function SelectedRowsBar<TData>({
  table,
  renderItem,
  onClear,
}: {
  table: Table<TData>;
  renderItem: (row: TData) => React.ReactNode;
  onClear?: () => void;
}) {
  const selectedRows = table.getSelectedRowModel().rows;

  const t = useTranslations();

  return (
    <AnimatePresence>
      {selectedRows.length > 0 && (
        <div className="mb-4 overflow-hidden rounded-lg border border-card/20 bg-primary/70 p-3 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2"
            >
              <span className="text-sm font-medium text-primary-foreground">
                {t("Selected")} ({selectedRows.length})
              </span>
            </motion.div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                table.resetRowSelection();
                onClear?.();
              }}
              className="h-6 bg-primary px-2 text-xs text-primary-foreground"
            >
              {t("Clear")}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedRows.map((row) => (
              <div
                key={row.id}
                className="flex items-center gap-1 rounded-full border border-primary-foreground/20 bg-primary/10 px-2 py-1"
              >
                {renderItem(row.original)}
                <button
                  onClick={() => row.toggleSelected(false)}
                  className="ml-1 rounded-full bg-primary/40 p-0.5 text-primary-foreground hover:bg-primary"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default memo(SelectedRowsBar) as typeof SelectedRowsBar;
