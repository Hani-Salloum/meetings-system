import React, { useState } from "react";

import { Icon } from "@iconify/react/dist/iconify.js";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { TableProps } from "@/components/table/types/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import TableDialog from "./table-dialog";

type MaxWidthTailwind =
  | "!max-w-xs"
  | "!max-w-sm"
  | "!max-w-md"
  | "!max-w-lg"
  | "!max-w-xl"
  | "!max-w-2xl"
  | "!max-w-3xl"
  | "!max-w-4xl"
  | "!max-w-5xl"
  | "!max-w-6xl"
  | "!max-w-7xl";

interface ShowTableDialogProps {
  locale: Locale;
  data: any;
  columns: any;
  title: string;
  showCancle?: boolean;
  icon: string;
  maxWidth?: MaxWidthTailwind;
}

export default function ShowTableDialog<TData extends { id: string | number }>(
  props: TableProps<TData> & ShowTableDialogProps
) {
  const [open, setOpen] = React.useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const { locale, data, columns, title, showCancle, icon } = props;

  const t = useTranslations();

  // حساب البيانات للصفحة الحالية
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return data.slice(startIndex, endIndex);
  }, [data, currentPage, pageSize]);

  // حساب إجمالي عدد الصفحات
  const totalPages = Math.ceil(data.length / pageSize);

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger
        disabled={!data || data.length === 0}
        className={cn(
          "mx-auto flex items-center justify-center gap-2 rounded-md border border-primary px-[16px] py-[8px] text-primary hover:bg-accent",
          (!data || data.length === 0) && "cursor-not-allowed opacity-50"
        )}
        title={!data || data.length === 0 ? t("There is no data") : ""}
      >
        {t("Show")}
        <Icon icon={icon} width="18" height="18" />
      </DialogTrigger>
      <DialogContent
        className={`overflow-y-auto border-none p-0 ${props.maxWidth} max-w-s`}
        aria-describedby="dialog-description"
      >
        <DialogHeader className="bg-custom_2-primary p-4">
          <DialogTitle className="text-md text-center font-semibold text-white md:text-lg">
            {t(title)}
          </DialogTitle>
        </DialogHeader>
        <div className="relative w-[calc(100%)] overflow-x-hidden p-5">
          <TableDialog
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            currentPage={currentPage}
            getColumns={columns}
            data={paginatedData}
            locale={locale}
            pageCount={totalPages}
          />

          {/* إضافة عناصر التحكم في الترقيم */}
          <div className="mt-3 flex items-center justify-between gap-5">
            <div className="flex items-center space-x-2">
              <p className="whitespace-nowrap text-sm font-medium">
                {t("RowsPerPage")}
              </p>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => setPageSize(Number(value))}
              >
                <SelectTrigger className="h-8 w-[4.5rem]">
                  <SelectValue placeholder={pageSize.toString()} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[3, 5, 10, 20, 30].map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <span className="text-sm text-primary">
              {t("Page")} {currentPage} {t("of")} {totalPages}
            </span>

            <div
              dir="ltr"
              className={cn(
                "flex items-center space-x-2",
                "w-fit rounded-md bg-primary px-2 py-0.5"
              )}
            >
              <Button
                type="button"
                aria-label="Go to first page"
                variant="link"
                className="hidden size-8 p-0 lg:flex"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft
                  className="size-4"
                  color="#fff"
                  aria-hidden="true"
                />
              </Button>
              <Button
                type="button"
                aria-label="Go to previous page"
                variant="link"
                size="icon"
                className="size-8"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev - +1, totalPages))
                }
                disabled={currentPage === 1}
              >
                <ChevronLeft
                  className="size-4"
                  color="#fff"
                  aria-hidden="true"
                />
              </Button>
              <Button
                type="button"
                aria-label="Go to next page"
                variant="link"
                size="icon"
                className="size-8"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight
                  className="size-4"
                  color="#fff"
                  aria-hidden="true"
                />
              </Button>
              <Button
                type="button"
                aria-label="Go to last page"
                variant="link"
                size="icon"
                className="hidden size-8 lg:flex"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight
                  className="size-4"
                  color="#fff"
                  aria-hidden="true"
                />
              </Button>
            </div>
          </div>

          {/* <div className="mt-4 flex items-center justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              {t("Previous")}
            </Button>
            <span className="text-sm text-gray-500">
              {t("Page")} {currentPage} {t("of")} {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              {t("Next")}
            </Button>
          </div> */}
        </div>

        {showCancle && (
          <DialogFooter className="mt-8">
            <div className="p-4">
              <Button
                type="button"
                variant={"destructive"}
                className="w-full"
                onClick={() => setOpen(false)}
              >
                {t("Cancel")}
              </Button>
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
