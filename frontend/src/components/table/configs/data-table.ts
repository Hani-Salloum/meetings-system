import { Pickaxe, SquareSquare } from "lucide-react";

export type DataTableConfig = typeof dataTableConfig;

export const dataTableConfig = {
  featureFlags: [
    {
      label: { en: "Advanced table", ar: "جدول متقدم" },
      value: "advancedTable" as const,
      icon: Pickaxe,
      tooltipTitle: { en: "Toggle advanced table", ar: "تبديل الجدول المتقدم" },
      tooltipDescription: {
        en: "A filter and sort builder to filter and sort rows.",
        ar: "منشئ لتصفية وفرز الصفوف.",
      },
    },
    {
      label: { en: "Floating bar", ar: "شريط عائم" },
      value: "floatingBar" as const,
      icon: SquareSquare,
      tooltipTitle: { en: "Toggle floating bar", ar: "تبديل الشريط العائم" },
      tooltipDescription: {
        en: "A floating bar that sticks to the top of the table.",
        ar: "شريط عائم يلتصق بأعلى الجدول.",
      },
    },
  ],
  textOperators: [
    { label: { en: "Contains", ar: "يحتوي" }, value: "iLike" as const },
    {
      label: { en: "Does not contain", ar: "لا يحتوي" },
      value: "notILike" as const,
    },
    { label: { en: "Is", ar: "هو" }, value: "eq" as const },
    { label: { en: "Is not", ar: "ليس" }, value: "ne" as const },
  ],
  numericOperators: [
    { label: { en: "Is", ar: "هو" }, value: "eq" as const },
    { label: { en: "Is not", ar: "ليس" }, value: "ne" as const },
    { label: { en: "Is less than", ar: "أقل من" }, value: "lt" as const },
    {
      label: { en: "Is less than or equal to", ar: "أقل من أو يساوي" },
      value: "lte" as const,
    },
    { label: { en: "Is greater than", ar: "أكبر من" }, value: "gt" as const },
    {
      label: { en: "Is greater than or equal to", ar: "أكبر من أو يساوي" },
      value: "gte" as const,
    },
  ],
  dateOperators: [
    { label: { en: "Is", ar: "هو" }, value: "eq" as const },
    { label: { en: "Is not", ar: "ليس" }, value: "ne" as const },
    { label: { en: "Is before", ar: "قبل" }, value: "lt" as const },
    { label: { en: "Is after", ar: "بعد" }, value: "gt" as const },
    {
      label: { en: "Is on or before", ar: "في أو قبل" },
      value: "lte" as const,
    },
    { label: { en: "Is on or after", ar: "في أو بعد" }, value: "gte" as const },
    { label: { en: "Is between", ar: "بين" }, value: "isBetween" as const },
    // {
    //   label: { en: "Is relative to today", ar: "نسبي إلى اليوم" },
    //   value: "isRelativeToToday" as const,
    // },
    // { label: { en: "Is empty", ar: "فارغ" }, value: "isEmpty" as const },
    // {
    //   label: { en: "Is not empty", ar: "ليس فارغ" },
    //   value: "isNotEmpty" as const,
    // },
  ],
  selectOperators: [
    { label: { en: "Is", ar: "هو" }, value: "eq" as const },
    { label: { en: "Is not", ar: "ليس" }, value: "ne" as const },
  ],
  booleanOperators: [
    { label: { en: "Is", ar: "هو" }, value: "eq" as const },
    { label: { en: "Is not", ar: "ليس" }, value: "ne" as const },
  ],
  joinOperators: [
    { label: { en: "And", ar: "و" }, value: "and" as const },
    { label: { en: "Or", ar: "أو" }, value: "or" as const },
  ],
  sortOrders: [
    { label: { en: "Asc", ar: "تصاعدي" }, value: "asc" as const },
    { label: { en: "Desc", ar: "تنازلي" }, value: "desc" as const },
  ],
  columnTypes: [
    "text",
    "number",
    "date",
    "boolean",
    "select",
    "multi-select",
  ] as const,
  globalOperators: [
    "iLike",
    "notILike",
    "eq",
    "ne",
    "isEmpty",
    "isNotEmpty",
    "lt",
    "lte",
    "gt",
    "gte",
    "isBetween",
    // "isRelativeToToday",
    "and",
    "or",
  ] as const,
};
