import * as React from "react";
import { useCallback, useMemo, useRef, useState } from "react";

import Cookies from "js-cookie";
import { useTranslations } from "next-intl";

import InputField from "@/components/FormBuilder/FormFields/input-field";
import FormBuilder from "@/components/FormBuilder/form-builder";
import useFormBuilder from "@/components/FormBuilder/hooks/use-form-builder";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/FormBuilder/ui/pagination";
import prepareFields from "@/components/FormBuilder/utils/prepare-fields";
import Yup from "@/components/FormBuilder/utils/yup";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";

function ShowListDialog({ list_data }: { list_data: string[] }) {
  const [open, setOpen] = React.useState(false);
  const [filteredList, setFilteredList] = React.useState(list_data);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const locale = (Cookies.get("NEXT_LOCALE") as "ar" | "en") ?? "ar";

  const t = useTranslations("ShowData");

  const inputRef = useRef<HTMLInputElement | null>(null);

  const updateFields = useMemo(
    () =>
      prepareFields({
        search: {
          yup: Yup.string(),
          type: "input",
          component: InputField,
          componentProps: () => ({
            required: true,
            variant: "under_line",
            label: t("Search"),
            placeholder: t("Search"),
            containerClassName: "col-span-12 p-0",
            labelClassName: "text-base font-semibold text-[#2f363d]",
            inputClassName: "border-[#2f363d]",
            ref: inputRef,
          }),
        },
      }),
    [t]
  );

  const formHooks = useFormBuilder(updateFields, {
    defaultValues: {
      search: "",
    },
  });

  const changeForm = useCallback(() => {
    setFilteredList(
      list_data?.filter((item) =>
        item
          .toLowerCase()
          .includes(formHooks.watch("search")?.toLowerCase() ?? "")
      )
    );
    setCurrentPage(1);
    inputRef.current?.focus();
  }, [list_data, formHooks]);

  const ListContent = React.memo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredList.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    const totalPages = Math.ceil(filteredList.length / itemsPerPage);

    return (
      <div className="grid gap-4 p-4">
        <form onChange={formHooks.handleSubmit(changeForm)}>
          <FormBuilder fields={updateFields} FormHooks={formHooks} />
        </form>
        <ul className="mt-4">
          {currentItems.map((item, index) => (
            <li key={index} className="py-3">
              {item}
            </li>
          ))}
        </ul>
        <Pagination className="mt-4">
          <PaginationContent>
            {locale === "ar" ? (
              <>
                <PaginationNext
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  isActive={(currentPage !== totalPages)}
                />
                {totalPages <= 7 ? (
                  Array.from({ length: totalPages }, (_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        isActive={(currentPage !== index + 1)}
                        onClick={() => setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))
                ) : (
                  <>
                    {Array.from({ length: totalPages }, (_, index) => {
                      if (index < 2 || index >= totalPages - 2 || Math.abs(currentPage - (index + 1)) <= 1) {
                        return (
                          <PaginationItem key={index}>
                            <PaginationLink
                              isActive={(currentPage !== index + 1)}
                              onClick={() => setCurrentPage(index + 1)}
                            >
                              {index + 1}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      if (index === 2) {
                        return <PaginationItem key="ellipsis1"><PaginationEllipsis /></PaginationItem>;
                      }
                      if (index === totalPages - 3) {
                        return <PaginationItem key="ellipsis2"><PaginationEllipsis /></PaginationItem>;
                      }
                      return null;
                    })}
                  </>
                )}
                <PaginationPrevious
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  isActive={currentPage === 1}
                />
              </>
            ) : (
              <>
                <PaginationPrevious
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  isActive={currentPage === 1}
                />
                {totalPages <= 7 ? (
                  Array.from({ length: totalPages }, (_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        isActive={(currentPage !== index + 1)}
                        onClick={() => setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))
                ) : (
                  <>
                    {Array.from({ length: totalPages }, (_, index) => {
                      if (index < 2 || index >= totalPages - 2 || Math.abs(currentPage - (index + 1)) <= 1) {
                        return (
                          <PaginationItem key={index}>
                            <PaginationLink
                              isActive={(currentPage !== index + 1)}
                              onClick={() => setCurrentPage(index + 1)}
                            >
                              {index + 1}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      if (index === 2) {
                        return <PaginationItem key="ellipsis1"><PaginationEllipsis /></PaginationItem>;
                      }
                      if (index === totalPages - 3) {
                        return <PaginationItem key="ellipsis2"><PaginationEllipsis /></PaginationItem>;
                      }
                      return null;
                    })}
                  </>
                )}
                <PaginationNext
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  isActive={(currentPage !== totalPages)}
                />
              </>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    );
  });

  ListContent.displayName = "ListContent";

  if (!list_data?.length) {
    return (
      <div className="text-center text-sm text-gray-500">{t("NoData")}</div>
    );
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">{t("ShowList")}</Button>
        </DialogTrigger>
        <DialogContent className="overflow-y-auto border-none p-0">
          <DialogHeader className="bg-primary p-4">
            <DialogTitle className="text-md text-center font-semibold text-white md:text-lg">
              {t("List")}
            </DialogTitle>
            <DialogDescription className="text-center text-white">
              {t("BrowseThroughTheList")}
            </DialogDescription>
          </DialogHeader>
          <ListContent />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      direction={locale === "ar" ? "right" : "left"}
      open={open}
      onOpenChange={setOpen}
    >
      <DrawerTrigger asChild>
        <Button variant="outline">{t("ShowList")}</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="">
          <DrawerTitle>{t("List")}</DrawerTitle>
          <DrawerDescription>{t("BrowseThroughTheList")}</DrawerDescription>
        </DrawerHeader>
        <ListContent />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">{t("Close")}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default ShowListDialog;
