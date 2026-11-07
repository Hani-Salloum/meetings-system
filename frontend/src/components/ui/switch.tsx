"use client";

import * as React from "react";

import * as SwitchPrimitives from "@radix-ui/react-switch";

import { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & {
    locale: Locale;
    checked: boolean;
  }
>(({ className, locale, checked, ...props }, ref) => {
  const translateClass = checked
    ? locale === "ar"
      ? "-translate-x-4"
      : "translate-x-4"
    : "translate-x-0";

  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary",
        checked ? "border-primary" : "border-gray-400",
        className
      )}
      checked={checked}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block h-4 w-4 rounded-full shadow-lg ring-0 transition-transform",
          checked ? "bg-white" : "bg-gray-400",
          `${translateClass}`
        )}
      />
    </SwitchPrimitives.Root>
  );
});
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
