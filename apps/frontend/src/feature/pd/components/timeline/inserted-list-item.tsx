"use client";

import { m, type TargetAndTransition } from "motion/react";
import type { ReactNode } from "react";

interface InsertedListItemProps {
  isInserted: boolean;
  children: ReactNode;
}

const collapsed: TargetAndTransition = {
  height: 0,
  opacity: 0,
  overflow: "hidden",
};

const expanded: TargetAndTransition = {
  height: "auto",
  opacity: 1,
  transitionEnd: { overflow: "visible" },
};

export function InsertedListItem({
  isInserted,
  children,
}: InsertedListItemProps) {
  return (
    <m.li
      animate={isInserted ? expanded : undefined}
      initial={isInserted ? collapsed : false}
      transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] }}
    >
      {children}
    </m.li>
  );
}
