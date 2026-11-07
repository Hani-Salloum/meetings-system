import { cn } from "@/lib/utils";

export default function IconButton({
  children,
  className,
  color = "primary",
  variant = "outline",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  color?: "primary" | "secondary" | "muted" | "accent" | "destructive";
  variant?: "outline" | "filled" | "ghost";
}) {
  return (
    <button
      className={cn(
        "rounded-full p-2 text-xs focus:outline",
        {
          "border-primary text-primary hover:bg-primary/10 hover:text-primary focus:outline-primary/80 focus:ring-primary/80":
            color === "primary",
          "border-secondary text-secondary hover:bg-secondary/10 hover:text-secondary focus:outline-secondary/80 focus:ring-secondary/80":
            color === "secondary",
          "border-muted text-muted hover:bg-muted/10 hover:text-muted focus:outline-muted/80 focus:ring-muted/80":
            color === "muted",
          "border-accent text-accent hover:bg-accent/10 hover:text-accent focus:outline-accent/80 focus:ring-accent/80":
            color === "accent",
          "border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive focus:outline-destructive/80 focus:ring-destructive/80":
            color === "destructive",
          border: variant === "outline",
          "bg-primary text-white": variant === "filled" && color === "primary",
          "bg-secondary text-white":
            variant === "filled" && color === "secondary",
          "bg-muted text-muted-foreground":
            variant === "filled" && color === "muted",
          "bg-accent text-accent-foreground":
            variant === "filled" && color === "accent",
          "bg-destructive text-destructive-foreground":
            variant === "filled" && color === "destructive",
          "border-none bg-transparent": variant === "ghost",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
