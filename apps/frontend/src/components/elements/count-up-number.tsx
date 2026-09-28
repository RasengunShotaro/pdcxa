"use client";

import { animate, useReducedMotionConfig } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { カウントアップ途中の表示値を決める } from "./count-up";

interface CountUpNumberProps {
  value: number;
  format?: (value: number) => string;
}

const COUNT_UP_DURATION_SECONDS = 0.6;
const EASE_OUT: [number, number, number, number] = [0, 0, 0.2, 1];

export function CountUpNumber({ value, format = String }: CountUpNumberProps) {
  const shouldReduceMotion = useReducedMotionConfig();
  const [latest, setLatest] = useState<number | "settled">(0);
  const firstTargetRef = useRef<number | null>(null);
  const settledRef = useRef(false);

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }
    const targetChanged =
      firstTargetRef.current !== null && firstTargetRef.current !== value;
    if (settledRef.current || targetChanged) {
      settledRef.current = true;
      setLatest("settled");
      return;
    }
    firstTargetRef.current = value;
    const controls = animate(0, value, {
      duration: COUNT_UP_DURATION_SECONDS,
      ease: EASE_OUT,
      onUpdate: setLatest,
      onComplete: () => {
        settledRef.current = true;
        setLatest("settled");
      },
    });
    return () => controls.stop();
  }, [value, shouldReduceMotion]);

  const displayed =
    latest === "settled" || shouldReduceMotion
      ? value
      : カウントアップ途中の表示値を決める({ latest, target: value });

  return format(displayed);
}
