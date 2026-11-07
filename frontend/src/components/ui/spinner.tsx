import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "pulse" | "gradient" | "dots" | "wave";
}

export function Spinner({
  className,
  size = "md",
  variant = "default",
  ...props
}: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const variants = {
    default: (
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-primary border-t-transparent",
          sizeClasses[size],
          className
        )}
        {...props}
      />
    ),
    pulse: (
      <div
        className={cn(
          "animate-pulse rounded-full bg-gradient-to-r from-primary to-primary/50",
          sizeClasses[size],
          className
        )}
        {...props}
      />
    ),
    gradient: (
      <div
        className={cn(
          "relative animate-spin rounded-full",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 animate-spin rounded-full bg-gradient-to-r from-primary via-secondary to-primary" />
        <div className="absolute inset-1 rounded-full bg-background" />
        <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>
    ),
    dots: (
      <div
        className={cn(
          "flex items-center justify-center space-x-1",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "h-2 w-2 animate-bounce rounded-full bg-primary",
              size === "sm" && "h-1 w-1",
              size === "lg" && "h-3 w-3"
            )}
            style={{
              animationDelay: `${i * 0.1}s`,
              animationDuration: "0.6s",
            }}
          />
        ))}
      </div>
    ),
    wave: (
      <div
        className={cn(
          "flex items-center justify-center space-x-1",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "h-full w-1 animate-pulse rounded-full bg-primary",
              size === "sm" && "w-0.5",
              size === "lg" && "w-1.5"
            )}
            style={{
              animationDelay: `${i * 0.1}s`,
              animationDuration: "0.8s",
            }}
          />
        ))}
      </div>
    ),
  };

  return variants[variant];
}
