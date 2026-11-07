# Decorate Toaster Function

function بسيطة لعرض رسائل toast مع promise.

## الاستخدام

### الاستخدام الأساسي

```typescript
import decorateToaster from "@/utils/toaster";

// استخدام بسيط
await decorateToaster(action());

// مع options
await decorateToaster(action(), {
  afterSuccess: (response) => {
    router.push("/dashboard");
  },
  afterFailed: (error) => {
    console.error("Operation failed:", error);
  },
});
```

### الخيارات المتاحة (options)

```typescript
interface ToasterOptions<T = unknown> {
  errorMessage?: string | boolean; // رسالة الخطأ (false لإخفائها)
  successMessage?: string | boolean; // رسالة النجاح (false لإخفائها)
  loadingMessage?: string | boolean; // رسالة التحميل (false لإخفائها)
  afterSuccess?: (response: T) => void; // callback بعد النجاح
  afterFailed?: (error: ApiResponse) => void; // callback بعد الفشل
  afterFinally?: () => void; // callback في النهاية
  disableDelays?: boolean; // تعطيل التأخيرات
}
```

### أمثلة الاستخدام

```typescript
// 1. استخدام بسيط
await decorateToaster(action());

// 2. رسائل مخصصة
await decorateToaster(action(), {
  loadingMessage: "جاري الحفظ...",
  successMessage: "تم الحفظ بنجاح",
  errorMessage: "فشل في الحفظ",
});

// 3. إخفاء رسائل معينة
await decorateToaster(action(), {
  loadingMessage: false, // لا تظهر رسالة التحميل
  successMessage: false, // لا تظهر رسالة النجاح
});

// 4. callbacks
await decorateToaster(action(), {
  afterSuccess: (response) => {
    router.push("/dashboard");
    console.log("Success:", response);
  },
  afterFailed: (error) => {
    console.error("Error:", error);
    setError(error.data.message);
  },
  afterFinally: () => {
    setIsLoading(false);
  },
});

// 5. تعطيل التأخيرات
await decorateToaster(action(), {
  disableDelays: true, // لا توجد تأخيرات
});

// 6. رسالة خطأ مخصصة
await decorateToaster(action(), {
  errorMessage: "حدث خطأ في العملية",
});
```

### الرسائل الافتراضية

```typescript
// العربية
{
  loading: "جار المعالجة ...",
  success: "تم العملية بنجاح",
  error: "حدث خطأ اثناء الاتصال بالسيرفر",
}

// الإنجليزية
{
  loading: "Loading...",
  success: "Operation successful",
  error: "There was an error while connecting to the server",
}
```

### مع React Components

```typescript
const MyComponent = () => {
  const handleSubmit = async () => {
    try {
      await decorateToaster(action(), {
        afterSuccess: () => {
          router.push("/dashboard");
        },
        afterFailed: (error) => {
          setError(error.data.message);
        },
      });
    } catch (error) {
      // معالجة الأخطاء غير المتوقعة
      console.error("Unexpected error:", error);
    }
  };

  return (
    <button onClick={handleSubmit}>
      Submit
    </button>
  );
};
```

## المزايا

1. **بسيط وسهل الاستخدام** - بارامترين فقط
2. **مرونة في التخصيص** - جميع الخيارات اختيارية
3. **دعم متعدد اللغات** - رسائل افتراضية للعربية والإنجليزية
4. **معالجة أخطاء شاملة** - للأخطاء المتوقعة وغير المتوقعة
5. **TypeScript support** - أنواع واضحة ومحددة
6. **أداء محسن** - تأخيرات قليلة وقابلة للتعطيل

## ملاحظات

- جميع الخيارات اختيارية
- إذا لم تحدد رسالة، ستستخدم الرسالة الافتراضية حسب اللغة
- يمكن إخفاء أي رسالة باستخدام `false`
- الـ callbacks تعمل بشكل طبيعي مع React
