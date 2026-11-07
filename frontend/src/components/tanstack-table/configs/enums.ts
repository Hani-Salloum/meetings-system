export const ENUMS = {
  // ? Here we will define all the enums for the project
  GENDER: {
    MALE: "MALE",
    FEMALE: "FEMALE",
    OTHER: "OTHER"
  }
} as const;

// Type definitions for each enum
export type EnumTypes = {
  [Key in keyof typeof ENUMS]: (typeof ENUMS)[Key][keyof (typeof ENUMS)[Key]];
};

// Generic type for filter options
export type FilterOption<T> = {
  label: string;
  value: T;
};

// Generic utility function to convert enum to filter options
export function enumToFilterOptions<T extends string>(
  enumObj: Record<string, T>,
  translate: (key: string) => string
): FilterOption<T>[] {
  return Object.values(enumObj).map((value) => ({
    label: translate(value),
    value,
  }));
}
