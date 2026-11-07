"use client";

import { ReactNode } from "react";

import { Icon } from "@iconify/react/dist/iconify.js";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import { Tooltip, TooltipContent } from "../ui/tooltip";

interface SharedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit: boolean;
  icon?: string;
  title: string;
  children: React.ReactNode;
  onSubmit: () => void;
  isPending: boolean;
  onCancel: () => void;
  hideButtons?: boolean;
  delayButtons?: number;
  hideSubmit?: boolean;
  cancelText?: string;
  hideTrigger?: boolean;
  widthContent?: string;
  cancelButton?: ReactNode;
  submitButton?: ReactNode;
  fullWidth?: boolean;
}

const SharedDialog: React.FC<SharedDialogProps> = ({
  open,
  onOpenChange,
  isEdit,
  icon,
  title,
  children,
  onSubmit,
  isPending,
  onCancel,
  hideButtons,
  delayButtons,
  hideSubmit,
  cancelText,
  hideTrigger,
  widthContent,
  cancelButton,
  submitButton,
  fullWidth,
}) => {
  const t = useTranslations("SharedDialog");
  const translate = useTranslations();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!hideTrigger && (
        <DialogTrigger
          className={cn(
            !isEdit &&
              !icon &&
              "rounded-md bg-primary px-5 py-2 text-white shadow-sm transition hover:bg-primary/90",
            isEdit ||
              (icon &&
                "flex items-center justify-center rounded-full p-2 transition hover:bg-accent")
          )}
        >
          {isEdit ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex h-8 w-8 items-center justify-center rounded-full text-primary hover:bg-primary/10 hover:text-primary">
                  <Icon icon="tabler:edit" width="16" height="16" />
                </div>
              </TooltipTrigger>
              <TooltipContent>{translate(title)}</TooltipContent>
            </Tooltip>
          ) : icon ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Icon
                  icon={icon}
                  width="16"
                  height="16"
                  className="text-primary"
                />
              </TooltipTrigger>
              <TooltipContent>{translate(title)}</TooltipContent>
            </Tooltip>
          ) : (
            <p className="text-sm text-white">{title}</p>
          )}
        </DialogTrigger>
      )}
      <DialogContent
        style={
          fullWidth
            ? {
                height: "100vh",
                minWidth: "100vw",
              }
            : {}
        }
        className={`max-h-[100vh] w-full max-w-xl ${widthContent} rounded-xl border border-border bg-background p-0 shadow-xl`}
        aria-describedby="dialog-description"
      >
        <DialogHeader className="h-fit rounded-t-xl border-b border-primary bg-primary/10 p-4">
          <DialogTitle className="text-start text-lg font-bold text-primary">
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {title}
            </motion.p>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit}>
          <div
            className="max-h-[80vh] overflow-y-auto px-6 py-4"
            id="dialog-description"
          >
            <p className="sr-only">
              {t("This dialog allows you to edit or add new information.")}
            </p>
            <div className="space-y-4">{children}</div>
          </div>
          <div className="overflow-hidden">
            {!hideButtons && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: delayButtons || 0 }}
              >
                <DialogFooter className="mx-10 gap-4 rounded-lg bg-gray-50 px-6 py-6 shadow-lg">
                  {cancelButton ? (
                    <div onClick={onCancel} className="w-full">
                      {cancelButton}
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex w-full items-center justify-center gap-2 border border-destructive bg-destructive/10 text-destructive transition hover:bg-destructive/20"
                      onClick={onCancel}
                    >
                      <Icon icon="tabler:x" className="size-4" />
                      {t(`${cancelText ? cancelText : "Cancel"}`)}
                    </Button>
                  )}
                  {!hideSubmit &&
                    (submitButton ? (
                      submitButton
                    ) : (
                      <Button
                        type="submit"
                        disabled={isPending}
                        className="flex w-full items-center justify-center gap-2 bg-primary text-white transition hover:bg-primary/90"
                      >
                        <Icon
                          icon={isPending ? "tabler:loader" : "tabler:check"}
                          className={`size-4 ${isPending ? "animate-spin" : ""}`}
                        />
                        {isPending ? t("Submitting") : t("Submit")}
                      </Button>
                    ))}
                </DialogFooter>
              </motion.div>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SharedDialog;
