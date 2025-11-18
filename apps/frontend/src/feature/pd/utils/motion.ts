import type { Variants } from "motion/react";

export const popInVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", bounce: 0.45, duration: 0.6 },
  },
} satisfies Variants;
