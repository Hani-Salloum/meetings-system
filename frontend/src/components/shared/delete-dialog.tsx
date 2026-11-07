"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { Icon } from "@iconify/react/dist/iconify.js";
import { type Row } from "@tanstack/react-table";
import { Loader, Trash } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";

import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import IconButton from "./icon-button";

interface DeleteDialogProps<T>
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  data?: Row<T>["original"][];
  showTrigger?: boolean;
  onDelete: (data: any) => void;
  onSuccess?: () => void;
  icon?: string;
}

export function DeleteDialog<T>({
  data,
  onDelete,
  icon,
  onSuccess,
  ...props
}: DeleteDialogProps<T>) {
  const t = useTranslations();
  const isDesktop = useMediaQuery("(min-width: 500px)");

  const [isDeletePending, setIsDeletePending] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  const TriggerButton = (
    <Button variant="secondary" className="bg-red-400 text-white" size="sm">
      <Trash className="mr-2 size-4" aria-hidden="true" />
      {t("Delete")}
      {data && data.length ? (
        <>
          {"("}
          {data?.length}
          {")"}
        </>
      ) : (
        ""
      )}
    </Button>
  );

  const TriggerIconButton = (
    <div>
      <Tooltip>
        <TooltipTrigger asChild>
          <IconButton variant="ghost" className="rounded-full">
            <Icon
              icon={icon ?? "fluent:delete-16-regular"}
              width="16"
              height="16"
            />
          </IconButton>
        </TooltipTrigger>
        <TooltipContent>{t("DeleteDialog.Delete")}</TooltipContent>
      </Tooltip>
    </div>
  );

  const handleDelete = async () => {
    try {
      setIsDeletePending(true);

      // Call the onDelete function passed as prop
      await onDelete(data);

      // Close the dialog and call onSuccess if provided
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error in delete operation:', error);
    } finally {
      setIsDeletePending(false);
    }
  };

  const DeleteContent = (
    <>
      <DialogHeader className="overflow-hidden p-0 text-white sm:text-center">
        <DialogTitle className="rounded-t-md bg-primary p-4">
          {t("DeleteDialog.AreYouSure")}
        </DialogTitle>
        <DialogDescription className="my-4 p-4 text-base text-[#2F363D]">
          {t("DeleteDialog.ActionCannotBeUndone")}{" "}
          {data ? (
            <>
              <span className="font-medium">{data.length}</span>
              {data.length === 1
                ? t("DeleteDialog.Item")
                : t("DeleteDialog.Items")}{" "}
              {t("DeleteDialog.FromServers")}
            </>
          ) : (
            <>
              {t("DeleteDialog.DeleteAll")} {t("DeleteDialog.FromServers")}
            </>
          )}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="bt-2 gap-2 border p-4 sm:space-x-0">
        <DialogClose asChild>
          <Button className="w-full" variant="outline">
            {t("DeleteDialog.Cancel")}
          </Button>
        </DialogClose>
        <Button
          className="w-full"
          aria-label={t("DeleteDialog.DeleteSelectedRows")}
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeletePending}
        >
          {isDeletePending && (
            <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />
          )}
          {t("DeleteDialog.Delete")}
        </Button>
      </DialogFooter>
    </>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen} {...props}>
        <DialogTrigger asChild>
          {icon ? TriggerIconButton : TriggerButton}
        </DialogTrigger>
        <DialogContent className="border-none bg-white p-0">
          {DeleteContent}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer direction="top" open={open} onOpenChange={setOpen} {...props}>
      <DialogTrigger asChild>
        {icon ? TriggerIconButton : TriggerButton}
      </DialogTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{"Are you absolutely sure?"}</DrawerTitle>
          <DrawerDescription>
            {data ? (
              <>
                {
                  "This action cannot be undone. This will permanently delete your"
                }{" "}
                <span className="font-medium">{data?.length}</span>
                {data?.length === 1 ? " item" : " items"} {"from our servers."}
              </>
            ) : (
              <>
                {t("DeleteDialog.ActionCannotBeUndone")}{" "}
                {t("DeleteDialog.DeleteAll")} {t("DeleteDialog.FromServers")}
              </>
            )}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose asChild>
            <Button variant="outline">{"Cancel"}</Button>
          </DrawerClose>
          <Button
            aria-label="Delete selected rows"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeletePending}
          >
            {isDeletePending && (
              <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />
            )}
            {"Delete"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
