"use client";

import { Heart } from "lucide-react";
import { motion, type Variants } from "motion/react";

const MotionHeart = motion.create(Heart);

const heartVariants = {
  idle: {
    scale: 1,
    rotate: 0,
    fill: "rgba(255,255,255,0)",
    strokeWidth: 1.8,
  },
  liked: {
    scale: [1, 1.35, 0.95, 1],
    rotate: [0, -12, 8, 0],
    fill: "rgb(255,10,100)",
    strokeWidth: 2,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
} satisfies Variants;

export function AnimatedHeart({ isActive }: { isActive: boolean }) {
  return (
    <MotionHeart
      animate={isActive ? "liked" : "idle"}
      className={`h-4 w-4 ${isActive && "text-red-500!"}`}
      fill="none"
      initial={false}
      strokeWidth={1.8}
      variants={heartVariants}
    />
  );
}
