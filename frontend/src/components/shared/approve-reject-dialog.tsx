"use client";

import * as React from "react";

import { Icon } from "@iconify/react/dist/iconify.js";
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

interface ApproveRejectDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  submit: () => void;
  onSuccess?: () => void;
  icon?: string;
  textColor?: string;
  message: string;
}

export function ApproveRejectDialog({
  submit,
  message,
  icon,
  textColor,
  onSuccess,
  ...props
}: ApproveRejectDialogProps) {
  const t = useTranslations();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const [isDeletePending, setIsDeletePending] = React.useState(false);

  const TriggerButton = (
    <Button variant="secondary" className="" size="sm">
      <Trash className="mr-2 size-4" aria-hidden="true" />
      {t("Delete")}
    </Button>
  );

  const TriggerIconButton = (
    <Button variant="ghost" className="rounded-full" size="sm">
      <Icon
        icon={icon ?? "fluent:delete-16-regular"}
        width="20"
        height="20"
        className={`${textColor || 'text-destructive'}`}
      />
    </Button>
  );

  const handleDelete = async () => {
    setIsDeletePending(true);

    try {
      await submit();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error in approve-reject action:", error);
    } finally {
      setIsDeletePending(false);
    }
  };

  const DeleteContent = (
    <>
      <DialogHeader className="overflow-hidden p-0 sm:text-center">
        <DialogTitle className="rounded-t-md p-4">
          {t("DeleteDialog.AreYouSure")}
        </DialogTitle>
        <DialogDescription className="my-4 p-4">{t(message)}</DialogDescription>
      </DialogHeader>
      <DialogFooter className="gap-2 p-4 sm:space-x-0">
        <DialogClose asChild>
          <Button variant="outline">{t("DeleteDialog.Cancel")}</Button>
        </DialogClose>
        <Button
          aria-label={t("DeleteDialog.DeleteSelectedRows")}
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeletePending}
        >
          {isDeletePending && (
            <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />
          )}
          {t("DeleteDialog.confirm")}
        </Button>
      </DialogFooter>
    </>
  );

  if (isDesktop) {
    return (
      <Dialog {...props}>
        <DialogTrigger asChild>
          {icon ? TriggerIconButton : TriggerButton}
        </DialogTrigger>
        <DialogContent className="max-w-xl border-none p-0 xl:max-w-xl">
          {DeleteContent}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer direction="top" {...props}>
      <DialogTrigger asChild>
        {icon ? TriggerIconButton : TriggerButton}
      </DialogTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t("DeleteDialog.AreYouSure")}</DrawerTitle>
          <DrawerDescription>{t(message)}</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose asChild>
            <Button variant="outline">{t("DeleteDialog.Cancel")}</Button>
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
            {t("DeleteDialog.confirm")}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
