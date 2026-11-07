"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Separator } from "./separator";

interface DialogWrapperProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
  title?: string;
  description?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DialogWrapper({
  children,
  trigger,
  title,
  description,
  open,
  onOpenChange,
}: DialogWrapperProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-max overflow-hidden px-0 max-h-[80vh]">
        {(title || description) && (
          <DialogHeader className="px-4">
            {title && <DialogTitle className="w-fit">{title}</DialogTitle>}
            {description && (
              <DialogDescription className="w-fit my-4">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}
        {(title || description) && <Separator className="my-4" />}
        <div className="max-h-[70vh] overflow-y-auto p-4">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
