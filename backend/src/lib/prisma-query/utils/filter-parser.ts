/* eslint-disable @typescript-eslint/no-explicit-any */
import { endOfDay, parseISO, startOfDay } from "date-fns";
import { z } from "zod";
import { filterSchema } from "../schema";
import { getFieldType, getSearchableFields, isFloatField } from "./field-type-checker";
import { operatorMap } from "./operator-map";

type Filter = z.infer<typeof filterSchema>;

function parseFieldPath(id: string, condition: any, filter?: Filter): Record<string, any> {
  console.log("parseFieldPath called with:", { id, condition, filter });

  // تقسيم المسار مع الاحتفاظ بـ [] لتحديد العلاقات one-to-many
  const parts = id.split(".").map((part) => {
    if (part.endsWith("[]")) {
      return { name: part.slice(0, -2), isList: true };
    }
    return { name: part, isList: false };
  });

  console.log("Parsed parts:", parts);

  const relationOperator = filter?.relationOperator || "some"; // الافتراضي some إذا لم يُحدد
  console.log("Using relationOperator:", relationOperator);

  // إذا كان هناك جزء واحد فقط (غير متداخل)
  if (parts.length === 1) {
    if (condition.OR || condition.NOT) {
      console.log("Returning condition as is due to OR/NOT presence:", condition);
      return condition;
    }
    console.log("Returning single part condition:", { [parts[0].name]: condition });
    return { [parts[0].name]: condition };
  }

  // بناء الشرط بشكل متداخل
  let nestedCondition: any = condition;
  console.log("Initial nestedCondition:", nestedCondition);

  // معالجة كل جزء في المسار من اليمين إلى اليسار
  for (let i = parts.length - 1; i >= 0; i--) {
    const part = parts[i];
    // تطبيق relationOperator إذا كان الحقل يمثل علاقة one-to-many
    if (part.isList) {
      nestedCondition = {
        [relationOperator]: nestedCondition,
      };
      console.log(`Applied relationOperator at part ${i} (${part.name}):`, nestedCondition);
    }
    nestedCondition = { [part.name]: nestedCondition };
    console.log(`Updated nestedCondition at part ${i} (${part.name}):`, nestedCondition);
  }

  console.log("Returning final nestedCondition:", JSON.stringify(nestedCondition, null, 2));
  return nestedCondition;
}

export function buildWhereClause(props: {
  filters: Filter[];
  prisma: any;
  tableName: string;
  search?: string;
  allowedFilterFields: { name: string; type: string }[];
  joinOperator?: "and" | "or"; // إضافة joinOperator
}): Record<string, any> {
  const { filters, prisma, tableName, search, joinOperator = "and" } = props;

  console.log(joinOperator);

  const where: Record<string, any> = {};
  // تجميع الفلاتر حسب الحقل
  const filterGroups: Record<string, Filter[]> = {};

  // تجميع الفلاتر بناءً على الحقل (id)
  for (const filter of filters) {
    const { id } = filter;
    if (!filterGroups[id]) {
      filterGroups[id] = [];
    }
    filterGroups[id].push(filter);
  }

  // مصفوفة لتخزين الشروط إذا كان joinOperator هو OR
  const orConditions: Record<string, any>[] = [];

  // معالجة كل مجموعة فلاتر
  for (const fieldId in filterGroups) {
    const fieldFilters = filterGroups[fieldId];
    const baseField = fieldId.split(".")[0];
    const fieldType = getFieldType(prisma, tableName, baseField) || fieldFilters[0].type;

    if (!fieldType || !operatorMap[fieldType as keyof typeof operatorMap]) {
      throw new Error(`نوع الحقل غير مدعوم: ${fieldId}`);
    }

    let conditionClause: Record<string, any>;

    // إذا كان هناك أكثر من فلتر واحد لنفس الحقل
    if (fieldFilters.length > 1) {
      // التحقق مما إذا كانت جميع الفلاتر تستخدم operator: 'eq'
      const allEq = fieldFilters.every((f) => f.operator === "eq");
      if (allEq) {
        // تجميع القيم في شرط in
        const values = fieldFilters.map((f) => {
          let parsedValue: any = f.value;
          if (fieldType === "number" && typeof parsedValue === "string") {
            parsedValue = parseFloat(parsedValue);
          } else if (
            fieldType === "date" &&
            typeof parsedValue === "string" &&
            f.operator !== "isBetween"
          ) {
            parsedValue = parseISO(parsedValue);
          } else if (fieldType === "boolean" && typeof parsedValue === "string") {
            parsedValue = parsedValue.toLowerCase() === "true";
          }
          return parsedValue;
        });
        const condition = { in: values };
        conditionClause = parseFieldPath(fieldId, condition, fieldFilters[0]);
      } else {
        // إذا كانت هناك عمليات مختلفة، دمجها باستخدام AND
        const conditions = fieldFilters.map((filter) => {
          const { operator, value } = filter;
          let parsedValue: any = value;
          if (fieldType === "number" && typeof value === "string") {
            parsedValue = parseFloat(value);
          } else if (
            fieldType === "date" &&
            typeof value === "string" &&
            operator !== "isBetween"
          ) {
            parsedValue = parseISO(value);
          } else if (fieldType === "boolean" && typeof value === "string") {
            parsedValue = value.toLowerCase() === "true";
          }
          //@ts-expect-error the type is unknown
          const condition = operatorMap[fieldType][operator](parsedValue);
          return parseFieldPath(fieldId, condition, filter);
        });

        if (joinOperator === "or") {
          conditionClause = { OR: conditions };
        } else {
          conditionClause = { AND: conditions };
        }
      }
    } else {
      // معالجة فلتر واحد
      const filter = fieldFilters[0];
      const { id, operator, value } = filter;

      let parsedValue: any = value;
      if (fieldType === "number" && typeof value === "string") {
        parsedValue = parseFloat(value);
      } else if (fieldType === "date" && typeof value === "string" && operator !== "isBetween") {
        parsedValue = parseISO(value);
      } else if (fieldType === "boolean" && typeof value === "string") {
        parsedValue = value.toLowerCase() === "true";
      }

      //@ts-expect-error the type is unknown
      const condition = operatorMap[fieldType][operator](parsedValue);
      conditionClause = parseFieldPath(id, condition, filter);
    }

    if (joinOperator === "or") {
      // إذا كان joinOperator هو OR، أضف الشرط إلى orConditions
      orConditions.push(conditionClause);
    } else {
      // إذا كان AND، ادمج الشرط مباشرة
      mergeWhereClause(where, conditionClause);
    }
  }

  // إذا كان joinOperator هو OR، ضع جميع الشروط في OR
  if (joinOperator === "or" && orConditions.length > 0) {
    where.OR = orConditions;
  }

  // معالجة البحث
  const searchableFields = getSearchableFields(prisma, tableName);
  if (search && search.trim() !== "") {
    const searchConditions = searchableFields
      .map((field) => {
        const fieldType = getFieldType(prisma, tableName, field);
        if (!fieldType) return null;

        if (fieldType === "text") {
          return { [field]: { contains: search.trim() } };
        }
        if (fieldType === "number") {
          const numericValue = parseFloat(search.trim());
          if (!isNaN(numericValue)) {
            if (isFloatField(prisma, tableName, field)) {
              const isIntegerSearch = Number.isInteger(numericValue);
              if (isIntegerSearch) {
                return { [field]: { gte: numericValue, lt: numericValue + 1 } };
              } else {
                return { [field]: { gte: numericValue - 0.01, lte: numericValue + 0.01 } };
              }
            } else {
              return { [field]: { equals: numericValue } };
            }
          }
          return null;
        }
        if (fieldType === "date") {
          try {
            const parsedDate = parseISO(search.trim());
            if (!isNaN(parsedDate.getTime())) {
              return { [field]: { gte: startOfDay(parsedDate), lte: endOfDay(parsedDate) } };
            }
            return null;
          } catch {
            return null;
          }
        }
        return null;
      })
      .filter((condition) => condition !== null);

    if (searchConditions.length > 0) {
      where.OR = where.OR || [];
      where.OR.push(...searchConditions);
    }
  }

  console.log(where);
  return where;
}

// دالة مساعدة لدمج الشروط بشكل صحيح
function mergeWhereClause(target: Record<string, any>, source: Record<string, any>) {
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      // التحقق مما إذا كان المفتاح هو equals, gte, lte أو قيمة بدائية
      if (
        ["equals", "gte", "lte", "gt", "lt", "isBetween"].includes(key) ||
        typeof source[key] !== "object" ||
        source[key] === null ||
        Array.isArray(source[key])
      ) {
        target[key] = source[key];
      } else {
        target[key] = target[key] || {};
        mergeWhereClause(target[key], source[key]);
      }
    }
  }
  console.log("Finished mergeWhereClause with final target:", target);
}
