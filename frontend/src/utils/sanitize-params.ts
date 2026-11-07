export const sanitizeParams = (_params: { [key: string]: any }) => {
  const FILTERS_KEY = "filters";
  const OPERATOR_IS_BETWEEN = "isBetween";

  return Object.keys(_params).reduce(
    (acc, key) => {
      const value = _params[key];

      if (key === FILTERS_KEY && Array.isArray(value)) {
        acc[key] = value.filter((item: any) => {
          if (
            item.operator === OPERATOR_IS_BETWEEN ||
            item.type === "multi-select"
          ) {
            return Array.isArray(item.value) && item.value.length > 0;
          }

          if (
            Array.isArray(item.value) &&
            item.operator !== OPERATOR_IS_BETWEEN
          ) {
            return false;
          }

          return item.value !== "";
        });
      } else if (typeof value === "object" && value !== null) {
        acc[key] = value;
      } else {
        acc[key] = value.toString();
      }

      return acc;
    },
    {} as Record<string, any>
  );
};
