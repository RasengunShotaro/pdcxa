"use client";

import { useEffect, useState } from "react";
import type { 大きさ } from "./image-viewer-zoom";

export const useFrameSize = (frame: HTMLElement | null): 大きさ => {
  const [size, setSize] = useState<大きさ>({ 幅: 0, 高さ: 0 });

  useEffect(() => {
    if (frame === null || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() =>
      setSize({ 幅: frame.clientWidth, 高さ: frame.clientHeight }),
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, [frame]);

  return size;
};
