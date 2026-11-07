# Table Component Documentation

## نظرة عامة

مكون `Table` هو مكون متقدم للجداول يدعم الفلترة المتقدمة، الترتيب، البحث، والتصفح. يستخدم `TanStack Table` مع `nuqs` لإدارة حالة URL.

## المميزات

- ✅ **فلترة متقدمة** - دعم فلترة متعددة مع مشغلات مختلفة
- ✅ **ترتيب متعدد** - إمكانية ترتيب حسب عدة أعمدة
- ✅ **بحث عام** - بحث في جميع الأعمدة
- ✅ **تصفح** - دعم الصفحات مع عدد صفوف قابل للتخصيص
- ✅ **حالة URL** - حفظ حالة الجدول في URL
- ✅ **Type Safety** - دعم كامل للـ TypeScript
- ✅ **دولية** - دعم الترجمة
- ✅ **قابل للتخصيص** - تخصيص كامل للأعمدة والإجراءات

## الاستخدام الأساسي

```tsx
import { Table } from "@/components/table/table";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function UsersPage() {
  const [data, setData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getColumns = () => [
    {
      accessorKey: "name",
      headerName: "Name",
      type: "text",
    },
    {
      accessorKey: "email",
      headerName: "Email",
      type: "text",
    },
    {
      accessorKey: "role",
      headerName: "Role",
      type: "select",
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
      ],
    },
    {
      accessorKey: "createdAt",
      headerName: "Created At",
      type: "date",
    },
  ];

  const refetch = useCallback((searchParams: TableSearchParams<User>) => {
    setIsLoading(true);
    // استدعاء API مع searchParams
    fetchUsers(searchParams)
      .then(setData)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <Table<User>
      data={data}
      getColumns={getColumns}
      refetch={refetch}
      isLoading={isLoading}
      pageCount={10}
    />
  );
}
```

## الخصائص (Props)

### الخصائص المطلوبة

| الخاصية      | النوع                              | الوصف                           |
| ------------ | ---------------------------------- | ------------------------------- |
| `data`       | `TData[]`                          | البيانات المراد عرضها في الجدول |
| `getColumns` | `ColumnDef[] \| () => ColumnDef[]` | تعريف الأعمدة                   |

### الخصائص الاختيارية

| الخاصية          | النوع                                        | الافتراضي | الوصف                   |
| ---------------- | -------------------------------------------- | --------- | ----------------------- |
| `pageCount`      | `number`                                     | `10`      | عدد الصفحات             |
| `isLoading`      | `boolean`                                    | `false`   | حالة التحميل            |
| `isError`        | `boolean`                                    | `false`   | حالة الخطأ              |
| `refetch`        | `(params: TableSearchParams<TData>) => void` | -         | دالة إعادة جلب البيانات |
| `withoutToolbar` | `boolean`                                    | `false`   | إخفاء شريط الأدوات      |
| `shallow`        | `boolean`                                    | `false`   | استخدام shallow routing |
| `filterFields`   | `DataTableFilterField<TData>[]`              | `[]`      | حقول الفلترة            |

## تعريف الأعمدة

### الخصائص الأساسية

```tsx
{
  accessorKey: "name",        // مفتاح البيانات
  headerName: "Name",         // اسم العمود (للترجمة)
  type: "text",               // نوع العمود
  enableColumnFilter: true,   // تفعيل فلترة العمود
}
```

### أنواع الأعمدة المدعومة

| النوع            | الوصف        | مثال          |
| ---------------- | ------------ | ------------- |
| `"text"`         | نص عادي      | اسم المستخدم  |
| `"number"`       | رقم          | العمر، السعر  |
| `"date"`         | تاريخ        | تاريخ الإنشاء |
| `"select"`       | قائمة منسدلة | الدور، الحالة |
| `"multi-select"` | اختيار متعدد | التصنيفات     |
| `"boolean"`      | صح/خطأ       | مفعل          |

### مثال شامل لتعريف الأعمدة

```tsx
const getColumns = () => [
  {
    accessorKey: "name",
    headerName: "Name",
    type: "text",
    enableColumnFilter: true,
  },
  {
    accessorKey: "email",
    headerName: "Email",
    type: "text",
    enableColumnFilter: true,
  },
  {
    accessorKey: "role",
    headerName: "Role",
    type: "select",
    options: [
      { label: "Admin", value: "admin" },
      { label: "User", value: "user" },
      { label: "Moderator", value: "moderator" },
    ],
  },
  {
    accessorKey: "status",
    headerName: "Status",
    type: "select",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
      { label: "Pending", value: "pending" },
    ],
  },
  {
    accessorKey: "createdAt",
    headerName: "Created At",
    type: "date",
  },
  {
    accessorKey: "isActive",
    headerName: "Active",
    type: "boolean",
  },
];
```

## الفلترة المتقدمة

### مشغلات الفلترة المدعومة

| المشغل         | الوصف                                | الأنواع المدعومة |
| -------------- | ------------------------------------ | ---------------- |
| `"eq"`         | يساوي                                | جميع الأنواع     |
| `"ne"`         | لا يساوي                             | جميع الأنواع     |
| `"contains"`   | يحتوي على                            | text             |
| `"iLike"`      | يحتوي على (غير حساس لحالة الأحرف)    | text             |
| `"notILike"`   | لا يحتوي على (غير حساس لحالة الأحرف) | text             |
| `"lt"`         | أقل من                               | number, date     |
| `"lte"`        | أقل من أو يساوي                      | number, date     |
| `"gt"`         | أكبر من                              | number, date     |
| `"gte"`        | أكبر من أو يساوي                     | number, date     |
| `"isBetween"`  | بين                                  | number, date     |
| `"isEmpty"`    | فارغ                                 | جميع الأنواع     |
| `"isNotEmpty"` | غير فارغ                             | جميع الأنواع     |

### مثال على الفلترة المتقدمة

```tsx
// في دالة refetch
const refetch = useCallback((searchParams: TableSearchParams<User>) => {
  console.log(searchParams.filters);
  // مثال للفلترة:
  // [
  //   {
  //     id: "name",
  //     value: "john",
  //     type: "text",
  //     operator: "iLike",
  //     rowId: "abc123"
  //   },
  //   {
  //     id: "role",
  //     value: ["admin", "moderator"],
  //     type: "select",
  //     operator: "eq",
  //     rowId: "def456"
  //   }
  // ]
}, []);
```

## الترتيب

### مثال على الترتيب

```tsx
// في دالة refetch
const refetch = useCallback((searchParams: TableSearchParams<User>) => {
  console.log(searchParams.sort);
  // مثال للترتيب:
  // [
  //   { id: "name", desc: false },
  //   { id: "createdAt", desc: true }
  // ]
}, []);
```

## البحث

### البحث العام

البحث العام يبحث في جميع الأعمدة المدعومة للبحث.

```tsx
// في دالة refetch
const refetch = useCallback((searchParams: TableSearchParams<User>) => {
  console.log(searchParams.search); // النص المدخل في البحث
}, []);
```

## إدارة الحالة

### TableSearchParams Interface

```tsx
interface TableSearchParams<TData> {
  filters: Filter<TData>[]; // الفلاتر النشطة
  joinOperator: JoinOperator; // "and" | "or"
  search: string; // نص البحث
  sort: ExtendedSortingState<TData>; // الترتيب
  page: number; // رقم الصفحة الحالية
}
```

### مثال على معالجة البيانات

```tsx
const refetch = useCallback(async (searchParams: TableSearchParams<User>) => {
  setIsLoading(true);

  try {
    // بناء query parameters
    const params = new URLSearchParams();

    // إضافة البحث
    if (searchParams.search) {
      params.append("search", searchParams.search);
    }

    // إضافة الصفحة
    params.append("page", searchParams.page.toString());

    // إضافة الفلاتر
    if (searchParams.filters.length > 0) {
      params.append("filters", JSON.stringify(searchParams.filters));
      params.append("joinOperator", searchParams.joinOperator);
    }

    // إضافة الترتيب
    if (searchParams.sort.length > 0) {
      params.append("sort", JSON.stringify(searchParams.sort));
    }

    const response = await fetch(`/api/users?${params}`);
    const data = await response.json();

    setData(data.users);
    setTotalPages(data.totalPages);
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    setIsLoading(false);
  }
}, []);
```

## التخصيص

### إخفاء شريط الأدوات

```tsx
<Table<User> data={data} getColumns={getColumns} withoutToolbar={true} />
```

### استخدام Shallow Routing

```tsx
<Table<User> data={data} getColumns={getColumns} shallow={true} />
```

### إضافة حقول فلترة مخصصة

```tsx
<Table<User>
  data={data}
  getColumns={getColumns}
  filterFields={[
    {
      id: "customField",
      label: "Custom Filter",
      placeholder: "Enter value...",
    },
  ]}
/>
```

## أفضل الممارسات

### 1. استخدام useCallback للـ refetch

```tsx
const refetch = useCallback((searchParams: TableSearchParams<User>) => {
  // منطق جلب البيانات
}, []);
```

### 2. معالجة الأخطاء

```tsx
<Table<User>
  data={data}
  getColumns={getColumns}
  refetch={refetch}
  isLoading={isLoading}
  isError={isError}
/>
```

### 3. تحسين الأداء

```tsx
// استخدام useMemo لتعريف الأعمدة
const columns = useMemo(() => getColumns(), [getColumns]);

<Table<User>
  data={data}
  getColumns={columns}
  // ...
/>;
```

### 4. التعامل مع البيانات الكبيرة

```tsx
// استخدام virtual scrolling للبيانات الكبيرة
const getColumns = () => [
  {
    accessorKey: "id",
    headerName: "ID",
    size: 80, // تحديد حجم العمود
  },
  // ...
];
```

## استكشاف الأخطاء

### مشاكل شائعة

1. **لا يتم تحديث البيانات**

   - تأكد من أن `refetch` يتم استدعاؤها
   - تحقق من أن `searchParams` تحتوي على البيانات الصحيحة

2. **مشاكل في الفلترة**

   - تأكد من أن `type` العمود صحيح
   - تحقق من أن `operator` مدعوم للنوع المحدد

3. **مشاكل في الترتيب**

   - تأكد من أن `accessorKey` موجود في البيانات
   - تحقق من أن العمود قابل للترتيب

4. **مشاكل في URL**
   - تأكد من أن `shallow` مضبوط بشكل صحيح
   - تحقق من أن `nuqs` مثبت ومُعد بشكل صحيح

## أمثلة إضافية

### جدول مع إجراءات مخصصة

```tsx
const getColumns = () => [
  // ... الأعمدة العادية
  {
    id: "actions",
    headerName: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button onClick={() => editUser(row.original)}>Edit</Button>
        <Button onClick={() => deleteUser(row.original.id)}>Delete</Button>
      </div>
    ),
  },
];
```

### جدول مع فلترة مخصصة

```tsx
const getColumns = () => [
  {
    accessorKey: "status",
    headerName: "Status",
    type: "select",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
    filterKey: "customStatus", // مفتاح مخصص للفلترة
  },
];
```

## الخلاصة

مكون `Table` يوفر حلاً شاملاً وقابلاً للتخصيص للجداول المتقدمة. مع دعم الفلترة المتقدمة، الترتيب، البحث، والتصفح، يمكن استخدامه في معظم حالات الاستخدام للجداول في التطبيق.
