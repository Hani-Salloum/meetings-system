import * as React from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export function CarouselDots({
  slides,
  activeIndex,
  onDotClick,
}: {
  slides: number;
  activeIndex: number;
  onDotClick: (index: number) => void;
}) {
  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: slides }).map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          className={cn(
            "rounded-full bg-white/40 transition-all duration-300",
            activeIndex === index ? "h-3 w-3" : "h-2 w-2"
          )}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
}

export function CarouselArrow({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-colors hover:bg-white/30"
      style={{ [direction]: "4rem" }}
      aria-label={`Go to ${direction === "left" ? "previous" : "next"} slide`}
    >
      {direction === "left" ? (
        <ChevronLeft className="h-6 w-6 text-white" />
      ) : (
        <ChevronRight className="h-6 w-6 text-white" />
      )}
    </button>
  );
}
