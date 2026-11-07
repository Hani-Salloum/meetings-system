import { permission_categories } from "./categories";
import { roles } from "./roles";

export const notifications = {
  "user_type:created": {
    // notification code
    code: "new_user_type:created",
    // notification category
    category: permission_categories.user_type,
    // roles that will receive the notification
    roles: [roles.admin],
    // details for admin to see
    name: {
      en: "on new user type created",
      ar: "الاشعار عند انشاء مستخدم جديد",
    },
    description: {
      en: "Sent when a new user type is created",
      ar: "يتم إرساله هذا الاشعار عند إنشاء نوع مستخدم جديد",
    },
    // title and message for user to see when receiving the notification
    title: {
      en: "User type created.",
      ar: "تم إنشاء نوع مستخدم.",
    },
    message: {
      en: "A new user type {{user_type_name}} has been created by {{created_by}}.",
      ar: "تم إنشاء نوع مستخدم {{user_type_name}} من قبل {{created_by}}.",
    },
    // variables to be replaced in the title and message
    variables: ["user_type_name", "created_by"],
  },
  "user_type:updated": {
    code: "user_type:updated",
    category: permission_categories.user_type,
    roles: [roles.admin],
    name: {
      en: "on user type updated",
      ar: "الاشعار عند تحديث نوع مستخدم",
    },
    description: {
      en: "Sent when a user type is updated",
      ar: "يتم إرساله هذا الاشعار عند تحديث نوع مستخدم",
    },
    title: {
      en: "User type updated.",
      ar: "تم تحديث نوع مستخدم.",
    },
    message: {
      en: "A user type {{user_type_name}} has been updated by {{updated_by}}.",
      ar: "تم تحديث نوع مستخدم {{user_type_name}} من قبل {{updated_by}}.",
    },
    variables: ["user_type_name", "updated_by"],
  },
} as const;

export type notificationsType = typeof notifications;

type ExtractVariables<T> = T extends { variables: readonly string[] }
  ? { [K in T["variables"][number]]: string | number }
  : undefined;

export type Variables<T extends keyof notificationsType> = ExtractVariables<notificationsType[T]>;
