import { parseISO } from "date-fns";

import { endOfDay } from "date-fns";

import { startOfDay } from "date-fns";

export const operatorMap = {
  number: {
    eq: (value: number) => value, // مباشرة بدون { equals: ... }
    ne: (value: number) => ({ not: value }),
    gt: (value: number) => ({ gt: value }),
    lt: (value: number) => ({ lt: value }),
    gte: (value: number) => ({ gte: value }),
    lte: (value: number) => ({ lte: value }),
    isBetween: (values: number[]) => ({
      gte: values[0],
      lte: values[1],
    }),
    isEmpty: () => ({ equals: undefined }),
    // isNotEmpty: () => ({ not: { equals: "" } }),
  },
  text: {
    eq: (value: string) => ({ equals: value }),
    ne: (value: string) => ({ not: value }),
    iLike: (value: string) => ({ contains: value }),
    notILike: (value: string) => ({ not: { contains: value } }),
    contains: (value: string) => ({ contains: value }),
    isEmpty: () => ({ equals: "" }), // سيتم معالجة هذا في filterParser
    isNotEmpty: () => ({ not: { equals: "" } }), // سيتم معالجة هذا في filterParser
  },
  date: {
    eq: (value: Date) => ({ gte: startOfDay(value), lte: endOfDay(value) }),
    ne: (value: Date) => ({ not: { gte: startOfDay(value), lte: endOfDay(value) } }),
    gt: (value: Date) => ({ gt: endOfDay(value) }),
    lt: (value: Date) => ({ lt: startOfDay(value) }),
    gte: (value: Date) => ({ gte: startOfDay(value) }),
    lte: (value: Date) => ({ lte: endOfDay(value) }),
    isBetween: (values: string[]) => {
      const [start, end] = values.map((date) => parseISO(date));
      return { gte: startOfDay(start), lte: endOfDay(end) };
    },
    isEmpty: () => ({ is: null }), // التاريخ null
    isNotEmpty: () => ({ not: { is: null } }), // التاريخ ليس null
  },
  boolean: {
    eq: (value: boolean) => value,
    ne: (value: boolean) => ({ not: value }),
    isEmpty: () => ({ is: null }), // القيمة المنطقية null
    isNotEmpty: () => ({ not: { is: null } }), // القيمة المنطقية ليست null
  },
  select: {
    eq: (value: string) => ({ equals: value }),
    ne: (value: string) => ({ not: value }),
  },
  "multi-select": {
    eq: (values: string[]) => ({ in: values }), // يستخدم in للقيم المتعددة
    ne: (values: string[]) => ({ notIn: values }), // يستخدم notIn
  },
};
