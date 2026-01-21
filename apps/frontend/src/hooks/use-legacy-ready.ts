"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { legacyDelay } from "@/utils/legacy-delay";

export const useLegacy待ち = () => {
  const { theme } = useTheme();
  const isLegacyTheme = theme === "legacy";
  const [isLegacy待機完了, setIsLegacy待機完了] = useState(
    () => !isLegacyTheme,
  );

  useEffect(() => {
    if (isLegacyTheme) {
      legacyDelay().then(() => setIsLegacy待機完了(true));
      return;
    }
    setIsLegacy待機完了(true);
  }, [isLegacyTheme]);

  return isLegacy待機完了;
};
