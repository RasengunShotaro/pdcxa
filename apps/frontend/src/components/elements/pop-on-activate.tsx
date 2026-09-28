"use client";

import { m } from "motion/react";
import { type ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { オンに切り替わったかを判定する } from "./toggle-activation";

interface PopOnActivateProps {
  active: boolean;
  children: ReactNode;
  ripple?: boolean;
  className?: string;
}

const easeOut = [0, 0, 0.2, 1] as const;

export function PopOnActivate({
  active,
  children,
  ripple = false,
  className,
}: PopOnActivateProps) {
  const [tracked, setTracked] = useState({ active, popCount: 0 });

  if (tracked.active !== active) {
    setTracked({
      active,
      popCount: オンに切り替わったかを判定する({
        previous: tracked.active,
        next: active,
      })
        ? tracked.popCount + 1
        : tracked.popCount,
    });
  }

  const hasPopped = tracked.popCount > 0;

  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center",
        className,
      )}
    >
      {ripple && hasPopped ? (
        <m.span
          animate={{ opacity: 0, scale: 1.8 }}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full border-2 border-primary"
          initial={{ opacity: 0.6, scale: 0.6 }}
          key={`ripple-${tracked.popCount}`}
          transition={{ duration: 0.3, ease: easeOut }}
        />
      ) : null}
      <m.span
        animate={hasPopped ? { scale: [1, 1.3, 1] } : undefined}
        className="inline-flex"
        key={tracked.popCount}
        transition={{ duration: 0.3, ease: easeOut, times: [0, 0.4, 1] }}
      >
        {children}
      </m.span>
    </span>
  );
}
