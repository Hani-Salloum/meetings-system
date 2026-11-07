"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { DialogWithHook, useBaseDialog } from "./index";

/**
 * مثال على استخدام الديالوغ الأساسي
 */
export function DialogExample() {
  // استخدام الـ hook مباشرة
  const { isOpen, open, close, toggle } = useBaseDialog("example-dialog");

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        أمثلة على استخدام الديالوغ الأساسي
      </h2>

      {/* أزرار للتحكم في الديالوغ */}
      <div className="flex gap-2">
        <Button onClick={open}>فتح الديالوغ</Button>
        <Button onClick={close}>إغلاق الديالوغ</Button>
        <Button onClick={toggle}>تبديل حالة الديالوغ</Button>
      </div>

      {/* عرض حالة الديالوغ */}
      <p>حالة الديالوغ: {isOpen ? "مفتوح" : "مغلق"}</p>

      {/* الديالوغ باستخدام DialogWithHook */}
      <DialogWithHook
        dialogName="example-dialog"
        title="مثال على الديالوغ"
        size="md"
        actionButtons={
          <>
            <Button variant="outline" onClick={close}>
              إلغاء
            </Button>
            <Button onClick={close}>حفظ</Button>
          </>
        }
      >
        <div className="space-y-4">
          <p>هذا مثال على محتوى الديالوغ.</p>

          <div className="space-y-2">
            <Label htmlFor="name">الاسم</Label>
            <Input id="name" placeholder="أدخل اسمك" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              placeholder="أدخل بريدك الإلكتروني"
            />
          </div>
        </div>
      </DialogWithHook>
    </div>
  );
}

/**
 * مثال على استخدام الديالوغ مع hook منفصل
 */
export function DialogWithCustomHook() {
  const { isOpen, open, close } = useBaseDialog("custom-dialog");

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">ديالوغ مع hook منفصل</h2>

      <Button onClick={open}>فتح ديالوغ مخصص</Button>

      {/* يمكن استخدام BaseDialog مباشرة مع الـ hook */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">ديالوغ مخصص</h3>
              <Button variant="ghost" size="sm" onClick={close}>
                ✕
              </Button>
            </div>

            <div className="mb-4">
              <p>محتوى الديالوغ المخصص</p>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={close}>
                إلغاء
              </Button>
              <Button onClick={close}>موافق</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
