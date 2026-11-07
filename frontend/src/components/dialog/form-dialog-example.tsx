"use client";

import { useState } from "react";

import AutocompleteField from "@/components/FormBuilder/FormFields/autocomplete-field";
import InputField from "@/components/FormBuilder/FormFields/input-field";
import prepareFields from "@/components/FormBuilder/utils/prepare-fields";
import Yup from "@/components/FormBuilder/utils/yup";

import { FormDialog, useFormDialog } from "./form-dialog";

// ============================================================================
// FIELD DEFINITIONS
// ============================================================================

const userFields = prepareFields({
  name: {
    yup: Yup.string().required("الاسم مطلوب"),
    type: "input" as const,
    component: InputField,
    componentProps: {
      label: "الاسم",
      placeholder: "أدخل الاسم",
      required: true,
      containerClassName: "col-span-6",
    },
  },
  email: {
    yup: Yup.string()
      .email("بريد إلكتروني غير صحيح")
      .required("البريد الإلكتروني مطلوب"),
    type: "email" as const,
    component: InputField,
    componentProps: {
      label: "البريد الإلكتروني",
      placeholder: "أدخل البريد الإلكتروني",
      type: "email",
      required: true,
      containerClassName: "col-span-6",
    },
  },
  role: {
    yup: Yup.string().required("الدور مطلوب"),
    type: "autocomplete" as const,
    component: AutocompleteField,
    componentProps: {
      label: "الدور",
      placeholder: "اختر الدور",
      required: true,
      containerClassName: "col-span-6",
      options: [
        { value: "admin", label: "مدير" },
        { value: "user", label: "مستخدم" },
        { value: "moderator", label: "مشرف" },
      ],
    },
  },
  phone: {
    yup: Yup.string(), // اختياري
    type: "input" as const,
    component: InputField,
    componentProps: {
      label: "رقم الهاتف",
      placeholder: "أدخل رقم الهاتف",
      type: "tel",
      containerClassName: "col-span-6",
    },
  },
});

// ============================================================================
// EXAMPLE COMPONENTS
// ============================================================================

// مثال 1: استخدام FormDialog مباشرة
export function FormDialogDirectExample() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (data: any) => {
    console.log("بيانات النموذج:", data);
    // محاكاة عملية حفظ البيانات
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("تم حفظ البيانات بنجاح!");
  };

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold">مثال الاستخدام المباشر</h2>

      <button
        onClick={() => setIsOpen(true)}
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        إضافة مستخدم جديد
      </button>

      <FormDialog
        fields={userFields}
        options={{
          defaultValues: {
            name: "",
            email: "",
            role: "",
            phone: "",
          },
          onSubmit: handleSubmit,
          title: "إضافة مستخدم جديد",
          submitText: "حفظ",
          cancelText: "إلغاء",
          size: "lg",
          formOptions: {
            mode: "onBlur",
            shouldFocusError: true,
          },
        }}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        beforeForm={
          <div className="mb-4 rounded bg-blue-50 p-3 text-sm text-blue-700">
            <p>يرجى ملء جميع الحقول المطلوبة</p>
          </div>
        }
        afterForm={
          <div className="mt-4 rounded bg-gray-50 p-3 text-sm text-gray-600">
            <p>* الحقول المطلوبة مميزة بعلامة (*)</p>
          </div>
        }
      />
    </div>
  );
}

// مثال 2: استخدام useFormDialog Hook
export function FormDialogHookExample() {
  const formDialog = useFormDialog(userFields, {
    defaultValues: {
      name: "",
      email: "",
      role: "",
      phone: "",
    },
    onSubmit: async (data) => {
      console.log("بيانات النموذج:", data);
      // محاكاة عملية حفظ البيانات
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("تم حفظ البيانات بنجاح!");
    },
    title: "إدارة المستخدمين",
    submitText: "حفظ",
    cancelText: "إلغاء",
    size: "lg",
    formOptions: {
      mode: "onBlur",
      shouldFocusError: true,
    },
  });

  // بيانات تجريبية للتعديل
  const sampleUser = {
    name: "أحمد محمد",
    email: "ahmed@example.com",
    role: "user",
    phone: "0123456789",
  };

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold">مثال استخدام Hook</h2>

      <div className="flex gap-2">
        <button
          onClick={formDialog.openAdd}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          إضافة مستخدم جديد
        </button>

        <button
          onClick={() => formDialog.openEdit(sampleUser)}
          className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        >
          تعديل مستخدم
        </button>

        <button
          onClick={() =>
            formDialog.open({ name: "محمد", email: "mohamed@test.com" })
          }
          className="rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
        >
          فتح مع بيانات مخصصة
        </button>
      </div>

      {/* عرض حالة الديالوغ */}
      <div className="rounded bg-gray-100 p-4">
        <h3 className="mb-2 font-semibold">حالة الديالوغ:</h3>
        <p>مفتوح: {formDialog.isOpen ? "نعم" : "لا"}</p>
        <p>العنوان: {formDialog.title}</p>
        <p>نص الزر: {formDialog.submitText}</p>
      </div>

      {/* FormDialog - استخدام dialogProps المجمعة */}
      <FormDialog
        {...formDialog.dialogProps}
        beforeForm={
          <div className="mb-4 text-sm text-gray-600">
            {formDialog.isEditMode
              ? `تعديل بيانات المستخدم: ${formDialog.editingData?.name}`
              : "أدخل بيانات المستخدم الجديد"}
          </div>
        }
      />
    </div>
  );
}

// مثال 3: نموذج مع أزرار مخصصة
export function FormDialogCustomButtonsExample() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (data: any) => {
    console.log("حفظ البيانات:", data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleDelete = () => {
    console.log("حذف المستخدم");
    setIsOpen(false);
  };

  const handlePreview = () => {
    console.log("معاينة البيانات");
  };

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold">مثال أزرار مخصصة</h2>

      <button
        onClick={() => setIsOpen(true)}
        className="rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
      >
        فتح نموذج مخصص
      </button>

      <FormDialog
        fields={userFields}
        options={{
          defaultValues: {
            name: "",
            email: "",
            role: "",
            phone: "",
          },
          onSubmit: handleSubmit,
          title: "نموذج مع أزرار مخصصة",
          submitText: "حفظ",
          cancelText: "إلغاء",
          size: "lg",
        }}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        customButtons={
          <div className="flex gap-2">
            <button
              onClick={() => setIsOpen(false)}
              className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
            >
              إلغاء
            </button>
            <button
              onClick={handlePreview}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              معاينة
            </button>
            <button
              onClick={handleDelete}
              className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              حذف
            </button>
            <button
              onClick={handleSubmit}
              className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            >
              حفظ
            </button>
          </div>
        }
      />
    </div>
  );
}

// مثال 4: نموذج متقدم مع خيارات كثيرة
export function FormDialogAdvancedExample() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (data: any) => {
    console.log("بيانات النموذج المتقدم:", data);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  };

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold">مثال متقدم</h2>

      <button
        onClick={() => setIsOpen(true)}
        className="rounded bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
      >
        فتح نموذج متقدم
      </button>

      <FormDialog
        fields={userFields}
        options={{
          defaultValues: {
            name: "",
            email: "",
            role: "",
            phone: "",
          },
          onSubmit: handleSubmit,
          title: "نموذج متقدم",
          submitText: "حفظ التغييرات",
          cancelText: "إلغاء",
          size: "xl",
          formOptions: {
            mode: "onChange",
            reValidateMode: "onBlur",
            shouldFocusError: true,
            criteriaMode: "all",
          },
        }}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        fullScreen={false}
        hideDividers={false}
        preventCloseOnOutsideClick={true}
        formClassName="grid grid-cols-12 gap-6"
        enableDevTools={true}
        beforeForm={
          <div className="mb-6 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-4">
            <h3 className="mb-2 text-lg font-semibold text-blue-800">
              نموذج متقدم
            </h3>
            <p className="text-sm text-blue-600">
              هذا مثال على نموذج متقدم مع خيارات كثيرة وتخصيص كامل
            </p>
          </div>
        }
        afterForm={
          <div className="mt-6 rounded-lg bg-gray-50 p-4">
            <h4 className="mb-2 font-semibold text-gray-800">ملاحظات:</h4>
            <ul className="text-sm text-gray-600">
              <li>• جميع الحقول المطلوبة مميزة بعلامة (*)</li>
              <li>• سيتم التحقق من صحة البريد الإلكتروني</li>
              <li>• يمكن إضافة رقم الهاتف اختيارياً</li>
            </ul>
          </div>
        }
      />
    </div>
  );
}

// ============================================================================
// MAIN EXAMPLE COMPONENT
// ============================================================================

export function FormDialogCompleteExample() {
  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold">أمثلة شاملة لـ FormDialog</h1>

      <FormDialogDirectExample />
      <hr className="my-8" />

      <FormDialogHookExample />
      <hr className="my-8" />

      <FormDialogCustomButtonsExample />
      <hr className="my-8" />

      <FormDialogAdvancedExample />
    </div>
  );
}
