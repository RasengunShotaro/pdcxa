"use client";

import { useEffect, useState } from "react";
import { legacyDelay } from "@/utils/legacy-delay";

const isLegacyTheme = () => {
  if (typeof window === "undefined") return false;
  return (
    window.localStorage.getItem("theme") === "legacy" ||
    document.documentElement.classList.contains("legacy")
  );
};

export const useLegacy待ち = () => {
  const [isLegacy待機完了, setIsLegacy待機完了] = useState(
    () => !isLegacyTheme(),
  );

  useEffect(() => {
    if (isLegacyTheme()) {
      legacyDelay().then(() => setIsLegacy待機完了(true));
      return;
    }
    setIsLegacy待機完了(true);
  }, []);

  return isLegacy待機完了;
};
