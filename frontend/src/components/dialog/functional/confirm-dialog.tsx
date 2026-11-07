"use client";

import { ReactNode } from "react";

import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

import { BaseDialog } from "../base/base-dialog";

export type ConfirmType = "danger" | "warning" | "info" | "success";

interface ConfirmDialogProps {
  /**
   * عنوان الديالوغ
   */
  title?: string;
  /**
   * رسالة التأكيد
   */
  message: string;
  /**
   * نوع التأكيد (يحدد الألوان والأيقونة)
   */
  type?: ConfirmType;
  /**
   * نص زر التأكيد
   */
  confirmText?: string;
  /**
   * نص زر الإلغاء
   */
  cancelText?: string;
  /**
   * حالة فتح/إغلاق الديالوغ
   */
  isOpen: boolean;
  /**
   * دالة التأكيد
   */
  onConfirm: () => void | Promise<void>;
  /**
   * دالة الإلغاء
   */
  onCancel?: () => void;
  /**
   * حالة التحميل
   */
  isLoading?: boolean;
  /**
   * حجم الديالوغ
   */
  size?: "sm" | "md" | "lg" | "xl" | "full";
  /**
   * وضع ملء الشاشة
   */
  fullScreen?: boolean;
  /**
   * إخفاء الفواصل
   */
  hideDividers?: boolean;
  /**
   * منع الإغلاق عند النقر خارج الديالوغ
   */
  preventCloseOnOutsideClick?: boolean;
  /**
   * محتوى مخصص بدلاً من الرسالة الافتراضية
   */
  children?: ReactNode;
  /**
   * أزرار مخصصة بدلاً من الأزرار الافتراضية
   */
  customButtons?: ReactNode;
}

const defaultConfig = {
  danger: {
    title: "confirm.delete.title",
    confirmText: "confirm.delete.confirmText",
    cancelText: "confirm.cancelText",
    icon: XCircle,
    confirmVariant: "destructive" as const,
    cancelVariant: "outline" as const,
  },
  warning: {
    title: "confirm.warning.title",
    confirmText: "confirm.warning.confirmText",
    cancelText: "confirm.cancelText",
    icon: AlertTriangle,
    confirmVariant: "default" as const,
    cancelVariant: "outline" as const,
  },
  info: {
    title: "confirm.info.title",
    confirmText: "confirm.info.confirmText",
    cancelText: "confirm.cancelText",
    icon: Info,
    confirmVariant: "default" as const,
    cancelVariant: "outline" as const,
  },
  success: {
    title: "confirm.success.title",
    confirmText: "confirm.success.confirmText",
    cancelText: "confirm.cancelText",
    icon: CheckCircle,
    confirmVariant: "default" as const,
    cancelVariant: "outline" as const,
  },
};

export function ConfirmDialog({
  title,
  message,
  type = "warning",
  confirmText,
  cancelText,
  isOpen,
  onConfirm,
  onCancel,
  isLoading = false,
  size = "md",
  fullScreen = false,
  hideDividers = false,
  preventCloseOnOutsideClick = false,
  children,
  customButtons,
}: ConfirmDialogProps) {
  const config = defaultConfig[type];
  const IconComponent = config.icon;

  const handleConfirm = async () => {
    if (!isLoading) {
      await onConfirm();
    }
  };

  const handleCancel = () => {
    if (!isLoading && onCancel) {
      onCancel();
    }
  };

  const defaultButtons = (
    <div className="flex gap-2">
      <Button
        variant={config.cancelVariant}
        onClick={handleCancel}
        disabled={isLoading}
      >
        {cancelText || config.cancelText}
      </Button>
      <Button
        variant={config.confirmVariant}
        onClick={handleConfirm}
        disabled={isLoading}
      >
        {isLoading ? "confirm.loading" : confirmText || config.confirmText}
      </Button>
    </div>
  );

  const content = children || (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0">
        <IconComponent className="h-6 w-6 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );

  return (
    <BaseDialog
      title={title || config.title}
      isOpen={isOpen}
      onClose={handleCancel}
      size={size}
      fullScreen={fullScreen}
      hideDividers={hideDividers}
      preventCloseOnOutsideClick={preventCloseOnOutsideClick}
      actionButtons={customButtons || defaultButtons}
    >
      {content}
    </BaseDialog>
  );
}
