"use client";

import { type ReactNode, useEffect, useState } from "react";

const MOCKING_ENABLED = process.env.NEXT_PUBLIC_API_MOCKING === "enabled";

export function MswProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(!MOCKING_ENABLED);

  useEffect(() => {
    if (!MOCKING_ENABLED) {
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const { worker } = await import("@/mocks/browser");
        await worker.start({ onUnhandledRequest: "bypass" });
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
