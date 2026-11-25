import type { Transition } from "motion/react";

export const GLASS_SELECTION_SPRING: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 30,
  mass: 0.9,
};
