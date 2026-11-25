"use client";

import { useSyncExternalStore } from "react";

const WIDE_QUERY = "(min-width: 900px)";

const 幅の変化を待つ = (onChange: () => void): (() => void) => {
  const media = window.matchMedia(WIDE_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
};

const 今の幅が広いか = (): boolean => window.matchMedia(WIDE_QUERY).matches;

const サーバーでは狭いとみなす = (): boolean => false;

export const useIsWide = (): boolean =>
  useSyncExternalStore(
    幅の変化を待つ,
    今の幅が広いか,
    サーバーでは狭いとみなす,
  );
