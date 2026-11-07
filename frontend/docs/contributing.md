# دليل المساهمة

شكراً لاهتمامك بالمساهمة في قالب RS4IT Next.js! سيساعدك هذا الدليل في فهم كيفية المساهمة بفعالية.

## 🤝 كيفية المساهمة

### اتفاقيات تسمية ال `brashes`:

- `feature/` - ميزات جديدة
- `fix/` - إصلاح الأخطاء
- `docs/` - تحديثات التوثيق
- `refactor/` - إعادة هيكلة الكود
- `test/` - إضافة أو تحديث الاختبارات
- `chore/` - مهام الصيانة

## 📝 إرشادات التطوير

### أسلوب الكود

نتبع معايير البرمجة التالية:

#### TypeScript

- استخدم TypeScript لجميع الكود الجديد
- حدد واجهات مناسبة لجميع الخصائص
- تجنب نوع `any` - استخدم التصنيف المناسب
- استخدم الأنواع العامة للمكونات القابلة لإعادة الاستخدام

```tsx
// ✅ جيد
interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
}

export default function UserCard({ user, onEdit }: UserCardProps) {
  return (
    <div>
      <h3>{user.name}</h3>
      {onEdit && (
        <button onClick={() => onEdit(user)}>تعديل</button>
      )}
    </div>
  );
}

// ❌ تجنب
export default function UserCard(props: any) {
  return <div>{props.user.name}</div>;
}
```

#### هيكل المكونات

- استخدم المكونات الوظيفية مع الـ hooks
- حافظ على تركيز المكونات وهدفها الواحد
- استخرج المنطق القابل لإعادة الاستخدام إلى hooks مخصصة
- أضف جميع hooks المكونات والأدوات المساعدة في مجلد المكون مثل `src/components/your-components/*` لتسهيل النقل والصيانة

```tsx
// ✅ جيد
export default function UserList({ users, onUserClick }: UserListProps) {
  const { isLoading, error } = useUsers();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {users.map((user) => (
        <UserCard key={user.id} user={user} onClick={() => onUserClick(user)} />
      ))}
    </div>
  );
}
```

#### تسمية الملفات

- **المكونات**: `kebab-case` (مثل `user-card.tsx`)
- **الـ `Hooks` يجب**: `kebab-case` مع بادئة `use` (مثل `use-user-data.ts`)
- **الأدوات المساعدة**: `kebab-case` (مثل `format-date.ts`)
- **الأنواع**: `kebab-case` مع امتداد `.d.ts` (مثل `user.d.ts`)
- **الصفحات**: `kebab-case` للمسارات (مثل `user-profile/page.tsx`)

### إرشادات المكونات

#### 1. واجهة الخصائص

حدد دائماً واجهة مناسبة لخصائص المكون:

```tsx
interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}
```

#### 2. الخصائص الافتراضية

استخدم المعاملات الافتراضية بدلاً من defaultProps:

```tsx
// ✅ جيد
export default function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  ...props
}: ButtonProps) {
  // منطق المكون
}

// ❌ تجنب
Button.defaultProps = {
  variant: "primary",
  size: "md",
  disabled: false,
};
```

#### 3. معالجات الأحداث

استخدم أنواع معالجات الأحداث المناسبة:

```tsx
interface FormProps {
  onSubmit: (data: FormData) => void;
  onCancel?: () => void;
}

export default function Form({ onSubmit, onCancel }: FormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // منطق النموذج
  };

  return <form onSubmit={handleSubmit}>{/* حقول النموذج */}</form>;
}
```

### إدارة الحالة

#### 1. الحالة المحلية

استخدم `useState` للحالة الخاصة بالمكون:

```tsx
export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <span>{count}</span>
      <button onClick={() => setCount(count + 1)}>زيادة</button>
    </div>
  );
}
```

#### 2. الحالة العامة

استخدم Zustand لإدارة الحالة العامة:

```tsx
// src/store/use-user-store.ts
interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
```

#### 3. حالة الرابط

استخدم حالة الرابط للبيانات القابلة للتصفية:

```tsx
import { useQueryState } from "nuqs";

export default function FilterableTable() {
  const [page, setPage] = useQueryState("page", { defaultValue: "1" });
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });

  // استخدم هذه القيم لاستدعاءات API
  // setPage("2") لتحديث الرابط
  // setSearch("بحث جديد") لتحديث معامل البحث
}
```

## 🌐 الترجمات

### إضافة الترجمات

1. **أضف اللغة** إلى `src/i18n/routing.ts`:

```ts
export const locales = ["en", "ar", "fr"] as const;
```

2. **أنشئ ملف الرسائل** في `src/i18n/messages/`:

- أضف ملفات اللغة في مجلد اللغة (`en/*`, `ar/*`, `fr/*`) ثم اسم الملف الذي أضفته سيكون المفتاح عند استخدامه. لكن إذا كان الاسم هو نفسه مثل اللغة مثل [src/i18n/messages/en/en.json](../src/i18n/messages/en/en.json) فلن يكون كذلك.

```json
{
  "common": {
    "save": "حفظ",
    "cancel": "إلغاء"
  },
  "errors": {
    "required": "هذا الحقل مطلوب"
  }
}
```

3. **استخدم الترجمات** في المكونات:

```tsx
import { useTranslations } from "next-intl";

export default function Component() {
  const t = useTranslations("common");

  return <button>{t("save")}</button>;
}
```

## أفضل الممارسات

إرشادات للاستخدام الأمثل.

## 🔄 عملية طلب السحب

### 1. قم بتغييراتك

- اكتب كود نظيف وموثق جيداً
- اتبع معايير البرمجة
- أضف اختبارات للميزات الجديدة
- حدث التوثيق حسب الحاجة

### 2. احفظ تغييراتك

استخدم رسائل الالتزام التقليدية:

```bash
# التنسيق: type(scope): description
git commit -m "feat(table): إضافة خيارات التصفية المتقدمة"
git commit -m "fix(auth): حل مشكلة إعادة توجيه تسجيل الدخول"
git commit -m "docs(readme): تحديث تعليمات التثبيت"
```

**أنواع الالتزام:**

- `feat` - ميزات جديدة
- `fix` - إصلاح الأخطاء
- `docs` - تغييرات التوثيق
- `style` - تغييرات أسلوب الكود
- `refactor` - إعادة هيكلة الكود
- `test` - إضافة أو تحديث الاختبارات
- `chore` - مهام الصيانة

### 3. ادفع تغييراتك

```bash
git push origin feature/your-feature-name
```

---

شكراً لك على المساهمة في قالب RS4IT Next.js! مساهماتك تساعد في جعل هذا المشروع أفضل للجميع.

<style>
  /* RTL styling for Arabic text */
  body * {
    direction: rtl;
    text-align: right;
    font-family: 'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  /* Keep code blocks LTR */
  body pre,
  body code,
  body .code-block {
    direction: ltr;
    text-align: left;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  } 
</style>
