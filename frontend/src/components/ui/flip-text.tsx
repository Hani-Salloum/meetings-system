"use client";

import { AnimatePresence, Variants, motion } from "motion/react";

import { cn } from "@/lib/utils";

interface FlipTextProps {
  word: string;
  duration?: number;
  delayMultiple?: number;
  framerProps?: Variants;
  className?: string;
}

export default function FlipText({
  word,
  duration = 0.5,
  delayMultiple = 0.08,
  framerProps = {
    hidden: { rotateX: -90, opacity: 0 },
    visible: { rotateX: 0, opacity: 1 },
  },
  className,
}: FlipTextProps) {
  const isArabic = /[\u0600-\u06FF]/.test(word);
  const segments = isArabic ? [word] : word.split("");

  return (
    <div
      className={`flex justify-center ${isArabic ? "space-x-0" : "space-x-2"}`}
    >
      <AnimatePresence mode="wait">
        {segments.map((segment, i) => (
          <motion.span
            key={i}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={framerProps}
            transition={{ duration, delay: i * delayMultiple }}
            className={cn("origin-center drop-shadow-sm", className)}
          >
            {segment}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
