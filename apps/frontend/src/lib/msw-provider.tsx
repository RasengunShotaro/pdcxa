"use client";

import { type ReactNode, useEffect, useState } from "react";

const MOCKING_ENABLED = process.env.NEXT_PUBLIC_API_MOCKING === "enabled";

export function MswProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(!MOCKING_ENABLED);

  useEffect(() => {
    // msw 3 の msw/browser は node 条件で export が null。typeof window で SSR バンドルから import を外さないと next build が解決に失敗する
    if (!MOCKING_ENABLED || typeof window === "undefined") {
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const { startWorker } = await import("@/mocks/browser");
        await startWorker();
      } catch (error) {
        console.error("MSW worker の起動に失敗しました", error);
      }
      if (!cancelled) {
        setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return null;
  }

  return children;
}
