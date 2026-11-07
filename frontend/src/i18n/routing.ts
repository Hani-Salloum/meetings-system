import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "ar"] as const,
  // Used when no locale matches
  defaultLocale: "ar" as const,
  localePrefix: "always",
  pathnames: {
    "/": {
      en: "/home",
      ar: "/المنزل",
    },
    "/dashboard": {
      en: "/dashboard",
      ar: "/dashboard",
    },
    "/profile": {
      en: "/profile",
      ar: "/profile",
    },
    "/user": {
      en: "/user",
      ar: "/المستخدمين",
    },
    "/auth/login": {
      en: "/auth/login",
      ar: "/auth/login",
    },
    "/auth/register": {
      en: "/auth/register",
      ar: "/auth/register",
    },
    "/register/[pathname]": {
      en: "/register/[pathname]",
      ar: "/register/[pathname]",
    },
    "/auth/register/step2": {
      en: "/auth/register/step2",
      ar: "/auth/register/step2",
    },
    "/auth/register/step3": {
      en: "/auth/register/step3",
      ar: "/auth/register/step3",
    },
    "/auth/confirm-code": {
      en: "/auth/confirm-code",
      ar: "/auth/confirm-code",
    },
    "/auth/reset-password": {
      en: "/auth/reset-password",
      ar: "/auth/reset-password",
    },
    "/auth/forget-password": {
      en: "/auth/forget-password",
      ar: "/auth/forget-password",
    },
    "/auth/sent-email": {
      en: "/auth/sent-email",
      ar: "/auth/sent-email",
    },
    "/user/user-type": {
      ar: "/user/user-type",
      en: "/user/user-type",
    },
    "/not-authorized": {
      ar: "/not-authorized",
      en: "/not-authorized",
    },
    "/too-many-requests": {
      ar: "/too-many-requests",
      en: "/too-many-requests",
    },
  },
});

// use typescript keyof instead of writing then two times
export type ValidHref = keyof typeof routing.pathnames;

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export type Locale = (typeof routing.locales)[number];
export const {
  Link,
  redirect,
  usePathname,
  useRouter,
  getPathname,
  permanentRedirect,
} = createNavigation(routing);
