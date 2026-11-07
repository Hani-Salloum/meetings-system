"use client";

import type { ReactNode } from "react";

import confetti, { Shape } from "canvas-confetti";

import { ButtonProps } from "@/components/ui/button";

type ConfettiButtonProps = ButtonProps & {
  options?: {
    spread?: number;
    ticks?: number;
    gravity?: number;
    decay?: number;
    startVelocity?: number;
    colors?: string[];
    particleCount?: number;
    scalar?: number;
    shapes?: Shape[];
  };
  className?: string;
  children?: ReactNode;
};

export function ConfettiStarsButton({
  options,
  children = "Trigger Confetti",
  className,
  ...props
}: ConfettiButtonProps) {
  const handleClick = () => {
    const defaults = {
      spread: 360,
      ticks: 50,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
      colors: ["#FFE400", "#FFBD00", "#E89400", "#FFCA6C", "#FDFFB8"],
      particleCount: 40,
      scalar: 1.2,
      shapes: ["star"],
    };
    const shoot = () => {
      confetti({
        ...defaults,
        ...options,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        shapes: options?.shapes || defaults.shapes,
      });

      confetti({
        ...defaults,
        particleCount: options?.particleCount || 10,
        scalar: options?.scalar || 0.75,
        shapes: options?.shapes || ["circle"],
      });
    };

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
  };

  return (
    <div className={className}>
      <button onClick={handleClick} {...props}>
        {children}
      </button>
    </div>
  );
}

ConfettiStarsButton.displayName = "ConfettiStarsButton";

export default ConfettiStarsButton;
