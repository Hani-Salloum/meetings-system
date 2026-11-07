import { Column } from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  EyeOff,
  MoveLeft,
  MoveRight,
  RefreshCcwDotIcon,
  X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { ColumnFilterPopover } from "./column-filter-popover";

export function ColumnActions({ column }: { column: Column<any, any> }) {
  const locale = useLocale();
  const t = useTranslations();

  const sorting = column.getIsSorted(); //?? 'asc' | 'desc' | false
  const pinning = column.getIsPinned(); //?? 'left' | 'right' | false

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="w-auto cursor-pointer px-0.5 py-0"
        >
          ⋮
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-52 flex-col gap-1 p-2">
        {column.columnDef.enableHiding && column.id !== "actions" && (
          <>
            <Button
              variant="ghost"
              onClick={() => column.toggleVisibility(!column.getIsVisible())}
            >
              {t("Hide")}
            </Button>
          </>
        )}

        {column.columnDef.enableSorting !== false &&
          column.id !== "actions" && (
            <>
              <Button
                variant="ghost"
                disabled={sorting === "asc"}
                onClick={() => column.toggleSorting(false)}
                className="justify-start"
              >
                {t("Ascending order")}
                <ArrowUp className="mr-2 h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                disabled={sorting === "desc"}
                onClick={() => column.toggleSorting(true)}
                className="justify-start"
              >
                {t("Descending order")}
                <ArrowDown className="mr-2 h-4 w-4" />
              </Button>
            </>
          )}

        {column.columnDef.enableColumnFilter !== false &&
          column.id !== "actions" && (
            <>
              <ColumnFilterPopover column={column} columnId={column.id} />
            </>
          )}

        {column.columnDef.enableHiding !== false && column.id !== "actions" && (
          <>
            <Button
              variant="ghost"
              onClick={() => column.toggleVisibility(false)}
              className="justify-start"
            >
              <EyeOff className="mr-2 h-4 w-4" /> {t("Hide column")}
            </Button>
          </>
        )}

        {column.columnDef.enableResizing !== false &&
          column.getIsResizing() === false && (
            <Button
              variant="ghost"
              onClick={() => column.resetSize()}
              className="justify-start"
            >
              <RefreshCcwDotIcon className="mr-2 h-4 w-4" />
              {t("Reset column width")}
            </Button>
          )}

        {column.columnDef.enablePinning !== false && (
          <>
            <Button
              variant="ghost"
              disabled={pinning === "left"}
              onClick={() => column.pin("left")}
              className="justify-start"
            >
              {" "}
              {locale === "ar" ? (
                <MoveRight className="mr-2 h-4 w-4" />
              ) : (
                <MoveLeft className="mr-2 h-4 w-4" />
              )}
              {locale === "ar" ? t("Right pinning") : t("Left pinning")}
            </Button>

            {/* تثبيت يمين */}
            <Button
              variant="ghost"
              disabled={pinning === "right"}
              onClick={() => column.pin("right")}
              className="justify-start"
            >
              {locale === "ar" ? (
                <MoveLeft className="mr-2 h-4 w-4" />
              ) : (
                <MoveRight className="mr-2 h-4 w-4" />
              )}
              {locale === "ar" ? t("Left pinning") : t("Right pinning")}
            </Button>

            {(pinning === "right" || pinning === "left") &&
              column.getIsPinned() !== false && (
                <Button
                  variant="ghost"
                  onClick={() => column.pin(false)}
                  className="justify-start"
                >
                  <X className="mr-2 h-4 w-4" /> {t("Remove pinning")}
                </Button>
              )}
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
