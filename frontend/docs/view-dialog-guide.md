# View Dialog Guide

## نظرة عامة

نظام `ViewDialog` هو نظام مرن لعرض البيانات في نوافذ منبثقة مع دعم أنواع مختلفة من البيانات وعرضها بطرق متعددة.

## المميزات

- **أنواع متعددة**: دعم string, number, boolean, image, link, table, list, object
- **متغيرات قابلة للتخصيص**: كل نوع له متغيرات مختلفة (مثل title للـ string)
- **مرونة في الوصول للبيانات**: استخدام `key` أو `valueAccessor`
- **تخصيص سهل**: إعدادات لكل عنصر منفصلة
- **TypeScript**: دعم كامل للأنواع

## الاستخدام الأساسي

### 1. إعداد الـ Hook

```tsx
import { useViewDialog } from "@/components/common/dialog/view-dialog";

const viewDialog = useViewDialog({
  name: "unique-name",
  dataToView: yourData,
  viewList: [
    {
      key: "name",
      type: "string",
      variant: "title",
      label: "الاسم",
    },
    {
      key: "email",
      type: "string",
      label: "البريد الإلكتروني",
    },
  ],
});
```

### 2. استخدام الـ Dialog

```tsx
import { ViewDialog } from "@/components/common/dialog/view-dialog";

<ViewDialog {...viewDialog.dialogProps} title="عرض البيانات" size="lg" />;
```

## أنواع البيانات المدعومة

### 1. String

```tsx
{
  key: "name",
  type: "string",
  variant: "default" | "title", // title هو المتغير الإضافي
  label: "الاسم",
  config: {
    maxLength: 50,
    align: "left" | "center" | "right",
    fontWeight: "normal" | "bold",
    asCode: false,
  },
}
```

### 2. Number

```tsx
{
  key: "age",
  type: "number",
  label: "العمر",
  config: {
    format: "number" | "currency" | "percentage" | "decimal",
    currency: "USD",
    decimals: 2,
    showSeparator: true,
    align: "left" | "right",
  },
}
```

### 3. Boolean

```tsx
{
  key: "isActive",
  type: "boolean",
  label: "الحالة",
  config: {
    showIcon: true,
    trueText: "نشط",
    falseText: "غير نشط",
    trueColor: "green" | "blue" | "purple",
    falseColor: "red" | "gray",
    size: "xs" | "sm" | "md" | "lg",
  },
}
```

### 4. Image

```tsx
{
  key: "avatar",
  type: "image",
  label: "الصورة",
  config: {
    width: 200,
    height: 200,
    quality: 75,
    priority: false,
    alt: "وصف الصورة",
    objectFit: "cover" | "contain" | "fill",
    borderRadius: "none" | "sm" | "md" | "lg" | "xl" | "full",
    showFullSize: true,
  },
}
```

### 5. Link

```tsx
{
  key: "website",
  type: "link",
  label: "الموقع",
  config: {
    showIcon: true,
    showExternalIcon: true,
    maxLength: 50,
    openInNewTab: true,
    color: "blue" | "green" | "purple" | "red",
    underline: true,
  },
}
```

### 6. Table

```tsx
{
  key: "items",
  type: "table",
  label: "العناصر",
  config: {
    columns: [
      { key: "name", label: "الاسم", width: "30%" },
      { key: "value", label: "القيمة", width: "70%" },
    ],
    maxRows: 10,
    striped: true,
    bordered: true,
    compact: false,
  },
}
```

### 7. List

```tsx
{
  key: "tags",
  type: "list",
  label: "العلامات",
  config: {
    maxItems: 10,
    showNumbers: true,
    bulletStyle: "disc" | "circle" | "square",
    inline: false,
    compact: false,
  },
}
```

### 8. Object

```tsx
{
  key: "metadata",
  type: "object",
  label: "البيانات الوصفية",
  config: {
    maxDepth: 3,
    showTypes: false,
    compact: false,
    collapsible: false,
    defaultCollapsed: false,
  },
}
```

## الوصول للبيانات

### استخدام Key

```tsx
{
  key: "name", // سيتم الوصول للبيانات عبر data.name
  type: "string",
}
```

### استخدام ValueAccessor

```tsx
{
  valueAccessor: (data) => data.user.profile.name, // وصول مخصص
  type: "string",
  label: "اسم المستخدم",
}
```

## خصائص الـ Dialog

```tsx
<ViewDialog
  {...viewDialog.dialogProps}
  title="عنوان مخصص"
  size="sm" | "md" | "lg" | "xl" | "full"
  preventCloseOnOutsideClick={false}
  hideDividers={false}
  fullScreen={false}
  actionButtons={<Button>إجراء مخصص</Button>}
  beforeContent={<div>محتوى قبل البيانات</div>}
  afterContent={<div>محتوى بعد البيانات</div>}
  contentClassName="custom-class"
/>
```

## مثال متكامل

```tsx
"use client";

import {
  ViewDialog,
  useViewDialog,
} from "@/components/common/dialog/view-dialog";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
  image: string;
  description: string;
  categories: string[];
  specifications: Record<string, any>;
}

const product: Product = {
  id: 1,
  name: "هاتف ذكي",
  price: 999.99,
  inStock: true,
  image: "https://example.com/phone.jpg",
  description: "هاتف ذكي متطور",
  categories: ["إلكترونيات", "هواتف", "تكنولوجيا"],
  specifications: {
    screen: "6.1 inch",
    battery: "4000mAh",
    storage: "128GB",
  },
};

export function ProductViewExample() {
  const viewDialog = useViewDialog({
    name: "product-view",
    dataToView: product,
    viewList: [
      {
        key: "name",
        type: "string",
        variant: "title",
        label: "اسم المنتج",
      },
      {
        key: "price",
        type: "number",
        label: "السعر",
        config: {
          format: "currency",
          currency: "SAR",
        },
      },
      {
        key: "inStock",
        type: "boolean",
        label: "متوفر",
        config: {
          trueText: "متوفر",
          falseText: "غير متوفر",
        },
      },
      {
        key: "image",
        type: "image",
        label: "صورة المنتج",
        config: {
          width: 200,
          height: 200,
          borderRadius: "lg",
        },
      },
      {
        key: "description",
        type: "string",
        label: "الوصف",
        config: {
          maxLength: 100,
        },
      },
      {
        key: "categories",
        type: "list",
        label: "الفئات",
        config: {
          inline: true,
          bulletStyle: "circle",
        },
      },
      {
        key: "specifications",
        type: "object",
        label: "المواصفات",
        config: {
          showTypes: true,
        },
      },
    ],
  });

  return (
    <div>
      <Button onClick={viewDialog.open}>عرض المنتج</Button>

      <ViewDialog {...viewDialog.dialogProps} title="تفاصيل المنتج" size="lg" />
    </div>
  );
}
```

## إضافة أنواع جديدة

لإضافة نوع جديد:

1. إنشاء مكون العرض في `viewers/`
2. إضافة النوع إلى `ViewType` في `types.ts`
3. إضافة المكون إلى `viewer-factory.tsx`

## أفضل الممارسات

1. **استخدم أسماء فريدة**: لكل `useViewDialog` استخدم اسم فريد
2. **حدد المتغيرات**: استخدم المتغيرات المناسبة لكل نوع
3. **استخدم valueAccessor**: للوصول المعقد للبيانات
4. **خصص الإعدادات**: استخدم `config` لتخصيص العرض
5. **أضف التسميات**: استخدم `label` لوصف واضح للبيانات

## استكشاف الأخطاء

### خطأ "No viewer found for type"

- تأكد من أن النوع مدعوم في `ViewType`
- تأكد من إضافة المكون إلى `viewer-factory.tsx`

### البيانات لا تظهر

- تأكد من صحة `key` أو `valueAccessor`
- تأكد من وجود البيانات في `dataToView`

### مشاكل في التنسيق

- راجع إعدادات `config` للنوع المستخدم
- تأكد من صحة قيم الإعدادات
