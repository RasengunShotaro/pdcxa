"use client";

import { useAppearancePreferences } from "../hooks/use-appearance-preferences";

export function AppearancePreferencesSync() {
  useAppearancePreferences();
  return null;
}
