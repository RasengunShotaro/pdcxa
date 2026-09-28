"use client";

import { AnimatePresence, m, type Variants } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  type CountDirection,
  件数の変化の向きを決める,
} from "./count-direction";

interface AnimatedCountProps {
  value: number;
  format?: (value: number) => string;
  className?: string;
}

const offsets: Record<CountDirection, string> = {
  up: "70%",
  down: "-70%",
  none: "0%",
};

const variants: Variants = {
  enter: (direction: CountDirection) => ({
    y: offsets[direction],
    opacity: direction === "none" ? 1 : 0,
  }),
  center: { y: "0%", opacity: 1 },
  exit: (direction: CountDirection) => ({
    y: direction === "down" ? "70%" : "-70%",
    opacity: 0,
  }),
};

export function AnimatedCount({
  value,
  format = String,
  className,
}: AnimatedCountProps) {
  const [tracked, setTracked] = useState<{
    value: number;
    direction: CountDirection;
  }>({ value, direction: "none" });

  if (tracked.value !== value) {
    setTracked({
      value,
      direction: 件数の変化の向きを決める({
        previous: tracked.value,
        next: value,
      }),
    });
  }

  const label = format(value);

  return (
    <span
      className={cn(
        "relative inline-flex overflow-hidden tabular-nums",
        className,
      )}
    >
      <AnimatePresence
        custom={tracked.direction}
        initial={false}
        mode="popLayout"
      >
        <m.span
          animate="center"
          custom={tracked.direction}
          exit="exit"
          initial="enter"
          key={value}
          transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}
          variants={variants}
        >
          {label}
        </m.span>
      </AnimatePresence>
    </span>
  );
}
