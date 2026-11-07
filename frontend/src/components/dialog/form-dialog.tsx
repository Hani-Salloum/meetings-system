"use client";

import { ReactNode, useEffect, useState } from "react";

import FormBuilder from "@/components/FormBuilder/form-builder";
import useFormBuilder, {
  InferFormValuesType,
} from "@/components/FormBuilder/hooks/use-form-builder";
// استيراد الأنواع من FormBuilder
import type { Field } from "@/components/FormBuilder/types/all-fields";
import { Button } from "@/components/ui/button";

import { BaseDialog } from "./base/base-dialog";

// ============================================================================
// TYPES
// ============================================================================

interface FormDialogOptions<T extends Record<string, Field<any>>> {
  /**
   * القيم الافتراضية للنموذج
   */
  defaultValues?: Partial<InferFormValuesType<T>>;
  /**
   * دالة الإرسال
   */
  onSubmit: (data: InferFormValuesType<T>) => void | Promise<void>;
  /**
   * عنوان الديالوغ
   */
  title?: string;
  /**
   * نص زر الإرسال
   */
  submitText?: string;
  /**
   * نص زر الإلغاء
   */
  cancelText?: string;
  /**
   * حجم الديالوغ
   */
  size?: "sm" | "md" | "lg" | "xl" | "full";
  /**
   * خيارات إضافية لـ useFormBuilder
   */
  formOptions?: {
    mode?: "onBlur" | "onChange" | "onSubmit" | "onTouched" | "all";
    reValidateMode?: "onBlur" | "onChange" | "onSubmit";
    criteriaMode?: "firstError" | "all";
    shouldFocusError?: boolean;
    shouldUnregister?: boolean;
    shouldUseNativeValidation?: boolean;
    delayError?: number;
  };
}

interface FormDialogProps<T extends Record<string, Field<any>>> {
  /**
   * الحقول المدمجة مع prepareFields
   */
  fields: T;
  /**
   * خيارات الديالوغ
   */
  options: FormDialogOptions<T>;
  /**
   * حالة فتح/إغلاق الديالوغ
   */
  isOpen: boolean;
  /**
   * دالة إغلاق الديالوغ
   */
  onClose: () => void;
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
   * محتوى مخصص قبل النموذج
   */
  beforeForm?: ReactNode;
  /**
   * محتوى مخصص بعد النموذج
   */
  afterForm?: ReactNode;
  /**
   * class name للنموذج
   */
  formClassName?: string;
  /**
   * أزرار مخصصة بدلاً من الأزرار الافتراضية
   */
  customButtons?: ReactNode;
  /**
   * تفعيل أدوات التطوير
   */
  enableDevTools?: boolean;
  /**
   * بيانات التعديل (من useFormDialog)
   */
  editingData?: InferFormValuesType<T> | null;
  /**
   * وضع التعديل (من useFormDialog)
   */
  isEditMode?: boolean;
}

// ============================================================================
// FORM DIALOG COMPONENT
// ============================================================================

export function FormDialog<T extends Record<string, Field<any>>>({
  fields,
  options,
  isOpen,
  onClose,
  fullScreen = false,
  hideDividers = false,
  preventCloseOnOutsideClick = false,
  beforeForm,
  afterForm,
  formClassName = "grid grid-cols-12 gap-4",
  customButtons,
  enableDevTools = false,
  editingData,
  isEditMode,
}: FormDialogProps<T>) {
  const {
    defaultValues = {} as Partial<InferFormValuesType<T>>,
    onSubmit,
    title: defaultTitle = "نموذج",
    submitText: defaultSubmitText = "حفظ",
    cancelText: defaultCancelText = "إلغاء",
    size: defaultSize = "md",
    formOptions = {},
  } = options;

  // إدارة حالة الديالوغ
  const [currentTitle, setCurrentTitle] = useState(defaultTitle);
  const [currentSubmitText, setCurrentSubmitText] = useState(defaultSubmitText);
  const [currentCancelText, setCurrentCancelText] = useState(defaultCancelText);
  const [currentSize, setCurrentSize] = useState(defaultSize);
  const [currentDefaultValues, setCurrentDefaultValues] =
    useState(defaultValues);
  const [isLoading, setIsLoading] = useState(false);

  // إعداد FormBuilder داخلياً
  const formHooks = useFormBuilder(fields, {
    defaultValues: currentDefaultValues as any,
    ...formOptions,
  });

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // إعادة تعيين النموذج عند فتح الديالوغ
  useEffect(() => {
    if (isOpen) {
      // إذا كان هناك بيانات معلقة (من useFormDialog)
      if (editingData && isEditMode) {
        setCurrentTitle(`${defaultTitle}`);
        setCurrentSubmitText(`${defaultSubmitText}`);
        setCurrentDefaultValues(editingData);
        formHooks.reset(editingData as any);
      } else {
        // وضع الإضافة العادي
        setCurrentTitle(defaultTitle);
        setCurrentSubmitText(defaultSubmitText);
        setCurrentDefaultValues(defaultValues);
        formHooks.reset(defaultValues as any);
      }
    }
  }, [isOpen, editingData, isEditMode]); // عند تغيير isOpen أو editingData أو isEditMode

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const data = formHooks.getValues();
      await onSubmit(data as InferFormValuesType<T>);
      onClose();
    } catch (error) {
      console.error("Error in form submission:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  const defaultButtons = (
    <div className="flex gap-2">
      <Button variant="outline" onClick={handleClose} disabled={isLoading}>
        {currentCancelText}
      </Button>
      <Button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? "Saving..." : currentSubmitText}
      </Button>
    </div>
  );

  return (
    <BaseDialog
      title={currentTitle}
      isOpen={isOpen}
      onClose={handleClose}
      size={currentSize}
      fullScreen={fullScreen}
      hideDividers={hideDividers}
      preventCloseOnOutsideClick={preventCloseOnOutsideClick}
      actionButtons={customButtons || defaultButtons}
    >
      {beforeForm && <div className="mb-4">{beforeForm}</div>}

      <div className={formClassName}>
        <FormBuilder
          fields={fields}
          FormHooks={formHooks}
          containerClassName="col-span-12"
          enableDevTools={enableDevTools}
        />
      </div>

      {afterForm && <div className="mt-4">{afterForm}</div>}
    </BaseDialog>
  );
}

// ============================================================================
// USE FORM DIALOG HOOK
// ============================================================================

export function useFormDialog<T extends Record<string, Field<any>>>(
  fields: T,
  options: FormDialogOptions<T>
) {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingData, setPendingData] = useState<InferFormValuesType<T> | null>(
    null
  );
  const [pendingMode, setPendingMode] = useState<"add" | "edit" | null>(null);

  const openAdd = () => {
    setPendingMode("add");
    setPendingData(null);
    setIsOpen(true);
  };

  const openEdit = (data: InferFormValuesType<T>) => {
    setPendingMode("edit");
    setPendingData(data);
    setIsOpen(true);
  };

  const open = (data?: Partial<InferFormValuesType<T>>) => {
    if (data) {
      setPendingMode("edit");
      // تحويل البيانات الجزئية إلى كاملة
      setPendingData(data as InferFormValuesType<T>);
    } else {
      setPendingMode("add");
      setPendingData(null);
    }
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setPendingMode(null);
    setPendingData(null);
  };

  const reset = () => {
    setIsOpen(false);
    setPendingMode(null);
    setPendingData(null);
  };

  // تجميع جميع البيانات المطلوبة للـ FormDialog
  const dialogProps = {
    fields,
    options,
    isOpen,
    onClose: close,
    editingData: pendingData,
    isEditMode: pendingMode === "edit",
  };

  return {
    // حالة الديالوغ
    isOpen,
    isEditMode: pendingMode === "edit",
    editingData: pendingData,

    // النصوص
    title: options.title || "نموذج",
    submitText: options.submitText || "حفظ",
    cancelText: options.cancelText || "إلغاء",
    size: options.size || "md",

    // الدوال
    openAdd,
    openEdit,
    open,
    close,
    reset,

    // دالة الإرسال المحسنة
    onSubmit: options.onSubmit,

    // القيم الافتراضية الحالية
    defaultValues: pendingData || options.defaultValues || {},

    // خيارات النموذج
    formOptions: options.formOptions || {},

    // تجميع البيانات للـ FormDialog
    dialogProps,
  };
}
