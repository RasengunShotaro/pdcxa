"use client";

import {
  AnimatePresence,
  type BezierDefinition,
  m,
  useAnimate,
} from "motion/react";
import { useEffect, useState } from "react";
import { AnimatedCount } from "./animated-count";
import {
  未読バッジを弾ませるか,
  未読件数を表示用に整える,
  表示上の未読件数に丸める,
} from "./unread-count";

interface UnreadBadgeProps {
  count: number;
}

const EASE_OUT: BezierDefinition = [0, 0, 0.2, 1];
const EASE_IN: BezierDefinition = [0.4, 0, 1, 1];

export function UnreadBadge({ count }: UnreadBadgeProps) {
  const [tracked, setTracked] = useState({ count, pops: 0 });
  const [scope, animate] = useAnimate<HTMLSpanElement>();

  if (tracked.count !== count) {
    setTracked({
      count,
      pops: 未読バッジを弾ませるか({ previous: tracked.count, next: count })
        ? tracked.pops + 1
        : tracked.pops,
    });
  }

  useEffect(() => {
    if (tracked.pops === 0 || !scope.current) {
      return;
    }
    animate(
      scope.current,
      { scale: [1, 1.2, 1] },
      { duration: 0.3, ease: EASE_OUT },
    );
  }, [tracked.pops, animate, scope]);

  return (
    <AnimatePresence initial={false}>
      {count > 0 ? (
        <m.span
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-50 px-1.5 text-xs font-medium text-red-600 dark:bg-red-500/15 dark:text-red-300"
          exit={{
            scale: 0,
            opacity: 0,
            transition: { duration: 0.15, ease: EASE_IN },
          }}
          initial={{ scale: 0, opacity: 0 }}
          ref={scope}
          transition={{ duration: 0.2, ease: EASE_OUT }}
        >
          <AnimatedCount
            format={未読件数を表示用に整える}
            value={表示上の未読件数に丸める(count)}
          />
          <span className="sr-only">件の未読の通知</span>
        </m.span>
      ) : null}
    </AnimatePresence>
  );
}
