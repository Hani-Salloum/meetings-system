"use client";

import { Icon } from "@iconify/react/dist/iconify.js";

import { Link, Locale, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type LinkButtonType = {
  id: string;
  icon: string;
  title: string;
  url: string;
  locale: Locale;
};

function LinkButton({ id, url, locale, icon, title }: LinkButtonType) {
  const pathname = usePathname();
  const is_active = pathname === url;
  return (
    <Link
      key={id}
      href={{
        pathname: url as any,
      }}
      className={cn(
        "group my-1.5 flex items-center gap-3 px-4 py-2.5 text-[#2B2A2D] hover:text-white",
        locale === "ar" &&
          "hover:bg-[linear-gradient(89.97deg,#8355A0_0.01%,#8355a05d_99.96%)]",
        locale === "en" &&
          "hover:bg-[linear-gradient(269.97deg,#8355A0_0.01%,#323940_99.96%)]",
        "transition-all duration-500",
        "border-custom_2-primary",
        {
          "rounded-r-md hover:border-r-8": locale === "ar",
          "rounded-l-md hover:border-l-8": locale === "en",
        },
        {
          "border-r-8 bg-[linear-gradient(89.97deg,#8355A0_0.01%,#8355a05d_99.96%)] text-white":
            is_active && locale === "ar",
          "border-l-8 bg-[linear-gradient(269.97deg,#8355A0_0.01%,#323940_99.96%)] text-white":
            is_active && locale === "en",
        }
      )}
    >
      <Icon
        icon={icon}
        width="24"
        height="24"
        className="text-primary group-hover:text-white"
      />
      <p className="text-[15px] font-semibold">{title}</p>
    </Link>
  );
}

export default LinkButton;
