export const roles = {
  admin: {
    en: "admin",
    ar: "مشرف",
  },
  user: {
    en: "user",
    ar: "مستخدم",
  },
} as const;

export type rolesType = typeof roles;
