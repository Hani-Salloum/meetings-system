"use client";

import { PropsWithChildren } from "react";

import { useLocale } from "next-intl";
import { Link } from "react-transition-progress/next";

import { ValidHref } from "@/i18n/routing";

interface Props {
  href: ValidHref;
  className?: string;
  query?: Record<string, string>;
  target?: "_blank" | "_self" | "_top" | "_parent";
  onClick?: () => void;
}

export default function ProgressLink({
  href,
  target = "_self",
  className,
  children,
  query,
  onClick,
}: PropsWithChildren<Props>) {
  const locale = useLocale();

  const resolvedHref = href.startsWith("http") ? href : `/${locale}${href}`;

  return (
    <Link
      href={
        query
          ? {
              pathname: resolvedHref,
              query,
            }
          : (resolvedHref as any)
      }
      className={className}
      target={target}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
