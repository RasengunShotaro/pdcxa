"use client";

import { useReducedMotionConfig } from "motion/react";
import { useState } from "react";
import {
  type InsertionPosition,
  一覧に新しく入った行を求める,
} from "./inserted-rows";

interface UseInsertedRowIdsInput {
  ids: readonly string[];
  isReady: boolean;
  position: InsertionPosition;
}

interface TrackedRows {
  key: string | null;
  ids: readonly string[] | null;
  inserted: readonly string[];
}

export function useInsertedRowIds({
  ids,
  isReady,
  position,
}: UseInsertedRowIdsInput): ReadonlySet<string> {
  const shouldReduceMotion = useReducedMotionConfig();
  const key = isReady ? ids.join("\n") : null;
  const [tracked, setTracked] = useState<TrackedRows>({
    key,
    ids: isReady ? ids : null,
    inserted: [],
  });

  if (tracked.key !== key) {
    setTracked({
      key,
      ids: isReady ? ids : null,
      inserted: isReady
        ? 一覧に新しく入った行を求める({
            previous: tracked.ids,
            next: ids,
            position,
          })
        : [],
    });
  }

  return new Set(shouldReduceMotion ? [] : tracked.inserted);
}
