import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler";
import { cn } from "@/lib/utils";

function ThemeToggler({ className }: { className?: string }) {
  return (
    <AnimatedThemeToggler
      className={cn("rounded-lg bg-card px-4 py-2", className)}
    />
  );
}

export default ThemeToggler;
