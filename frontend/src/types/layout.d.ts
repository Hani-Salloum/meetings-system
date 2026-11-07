import { Locale } from "@/i18n/routing";

declare module "next" {
  interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{
      locale: Locale;
    }>;
  }
}



declare namespace Layout {
  interface Submenu  {
    href: string;
    label: string;
    active?: boolean;
  };

  interface Menu  {
    href: string;
    label: string;
    active?: boolean;
    icon: string;
    submenus?: Submenu[];
    actions?: string[];
  };

  interface Group  {
    groupLabel: string;
    menus: Menu[];
  };

}
