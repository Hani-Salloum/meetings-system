export const permission_categories = {
  user: {
    en: "user",
    ar: "المستخدمين",
    description: {
      en: "User",
      ar: "المستخدم",
    },
  },
  user_type: {
    en: "user_type",
    ar: "نوع المستخدم",
    description: {
      en: "User type",
      ar: "نوع المستخدم",
    },
  },
  project_meetings: {
    en: "project_meetings",
    ar: "اجتماعات المشروع",
    description: {
      en: "Project meetings",
      ar: "اجتماعات المشروع",
    },
  },
  meeting_requests: {
    en: "meeting_requests",
    ar: "طلبات الاجتماعات",
    description: {
      en: "Meeting requests",
      ar: "طلبات الاجتماعات",
    },
  },
  client: {
    en: "client",
    ar: "العميل",
    description: {
      en: "Client",
      ar: "العميل",
    },
  },
  availability: {
    en: "availability",
    ar: "التوفر",
    description: {
      en: "Employee availability",
      ar: "توفر الموظفين",
    },
  },
  notification_settings: {
    en: "notification_settings",
    ar: "إعدادات الإشعارات",
    description: {
      en: "Notification settings",
      ar: "إعدادات الإشعارات",
    },
  },
  service_requests: {
    en: "service_requests",
    ar: "طلبات الخدمات",
    description: {
      en: "Service requests",
      ar: "طلبات الخدمات",
    },
  },
  statistics: {
    en: "statistics",
    ar: "الإحصائيات",
    description: {
      en: "Statistics",
      ar: "الإحصائيات",
    },
  },
  services: {
    en: "services",
    ar: "الخدمات",
    description: {
      en: "Services",
      ar: "الخدمات",
    },
  },
} as const;

export type permission_categoriesType = typeof permission_categories;
