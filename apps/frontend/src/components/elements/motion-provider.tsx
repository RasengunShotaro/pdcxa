"use client";

import { domMax, LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { useAppearancePreferences } from "@/feature/settings/hooks/use-appearance-preferences";

interface MotionProviderProps {
  children: ReactNode;
}

export function MotionProvider({ children }: MotionProviderProps) {
  const { settings } = useAppearancePreferences();

  return (
    <LazyMotion features={domMax}>
      <MotionConfig reducedMotion={settings.reduceMotion ? "always" : "user"}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
