"use client";

import { useEffect } from "react";
import { useAppearancePreferences } from "@/feature/settings/hooks/use-appearance-preferences";
import { 描く背景を決める } from "@/feature/settings/utils/appearance-preferences";
import { 背景の部品を選ぶ, 選べる背景 } from "./backdrop-registry";

export function AppBackdrop() {
  const { settings } = useAppearancePreferences();
  const kind = 描く背景を決める({
    backdrop: settings.backdrop,
    available: 選べる背景,
  });
  const Backdrop = 背景の部品を選ぶ(kind);

  useEffect(() => {
    document.documentElement.dataset.backdrop = kind;
    return () => {
      delete document.documentElement.dataset.backdrop;
    };
  }, [kind]);

  return Backdrop ? (
    <Backdrop />
  ) : (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 bg-bg-page"
      data-app-backdrop="plain"
    />
  );
}
