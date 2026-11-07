"use client";

import { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BaseDialogProps {
  /**
   * عنوان الديالوغ
   */
  title: string;
  /**
   * محتوى الديالوغ
   */
  children: ReactNode;
  /**
   * أزرار الإجراءات في نهاية الديالوغ
   */
  actionButtons?: ReactNode;
  /**
   * حالة فتح/إغلاق الديالوغ
   */
  isOpen: boolean;
  /**
   * دالة إغلاق الديالوغ
   */
  onClose: () => void;
  /**
   * حجم الديالوغ
   */
  size?: keyof typeof sizeClasses;
  /**
   * منع الإغلاق عند النقر خارج الديالوغ
   */
  preventCloseOnOutsideClick?: boolean;
  /**
   * إخفاء الفواصل بين الأقسام
   */
  hideDividers?: boolean;
  /**
   * وضع ملء الشاشة بالكامل
   */
  fullScreen?: boolean;
}
const sizeClasses = {
  sm: "!max-w-sm",
  md: "!max-w-md",
  lg: "!max-w-lg",
  xl: "!max-w-xl",
  "2xl": "!max-w-2xl",
  "3xl": "!max-w-3xl",
  "4xl": "!max-w-4xl",
  "5xl": "!max-w-5xl",
  "6xl": "!max-w-6xl",
  "7xl": "!max-w-7xl",
  full: "!max-w-[95vw]",
};

/**
 * مكون الديالوغ الأساسي مع تصميم بسيط
 * يحتوي على header مع العنوان وزر الإغلاق، content، وأزرار الإجراءات
 */
export function BaseDialog({
  title,
  children,
  actionButtons,
  isOpen,
  onClose,
  size = "md",
  preventCloseOnOutsideClick = false,
  hideDividers = false,
  fullScreen = false,
}: BaseDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`${
          fullScreen
            ? "!m-0 flex !h-screen !max-h-screen !w-screen !max-w-none flex-col !rounded-none"
            : sizeClasses[size]
        } ${fullScreen ? "" : "max-h-[90vh] overflow-auto"}`}
        onPointerDownOutside={
          preventCloseOnOutsideClick ? (e) => e.preventDefault() : undefined
        }
      >
        {/* Header */}
        <DialogHeader
          className={`flex flex-row items-center justify-between space-y-0 ${
            !hideDividers ? "border-b pb-4" : "pb-4"
          } ${fullScreen ? "flex-shrink-0" : ""}`}
        >
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
        </DialogHeader>

        {/* Content */}
        <div
          className={`${
            fullScreen
              ? "flex-1 overflow-y-auto"
              : "my-4 min-h-0 flex-1 overflow-y-auto"
          }`}
        >
          {children}
        </div>

        {/* Action Buttons */}
        {actionButtons && (
          <div
            className={`flex justify-end gap-2 ${
              !hideDividers ? "border-t pt-4" : "pt-4"
            } ${fullScreen ? "flex-shrink-0" : ""}`}
          >
            {actionButtons}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
