import { useCallback } from "react";

import { parseAsString, useQueryState } from "nuqs";

/**
 * Hook لإدارة حالة الديالوغ باستخدام URL state
 * @param dialogName اسم الديالوغ (يجب أن يكون فريد)
 * @returns object يحتوي على حالة الديالوغ ودوال التحكم
 */
export function useBaseDialog(dialogName: string) {
  const [openDialog, setOpenDialog] = useQueryState(
    "dialog",
    parseAsString.withDefault("")
  );

  // التحقق من أن الديالوغ مفتوح
  const isOpen = openDialog === dialogName;

  // فتح الديالوغ
  const open = useCallback(() => {
    setOpenDialog(dialogName);
  }, [dialogName, setOpenDialog]);

  // إغلاق الديالوغ
  const close = useCallback(() => {
    setOpenDialog("");
  }, [setOpenDialog]);

  // تبديل حالة الديالوغ
  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}
