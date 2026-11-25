"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Linkify } from "@/components/ui/linkify";
import { cn } from "@/lib/utils";

type ClampLines = 3 | 8;

interface PdBodyProps {
  content: string;
  clamp?: boolean;
  lines?: ClampLines;
  className?: string;
}

const CLAMP_CLASS: Record<ClampLines, { clamp: string; height: string }> = {
  3: { clamp: "line-clamp-3", height: "h-[3lh]" },
  8: { clamp: "line-clamp-8", height: "h-[8lh]" },
};

export function PdBody({
  content,
  clamp = true,
  lines = 8,
  className,
}: PdBodyProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const clamped = clamp && !expanded;

  useEffect(() => {
    const element = ref.current;
    if (!clamped || !element) {
      return;
    }
    const measure = () =>
      setOverflowing(element.scrollHeight > element.clientHeight + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [clamped]);

  return (
    <>
      <p
        className={cn(
          "whitespace-pre-wrap break-words text-[0.9375rem] leading-[1.8] text-ink [overflow-wrap:anywhere]",
          className,
          clamped && CLAMP_CLASS[lines].clamp,
          clamped && overflowing && CLAMP_CLASS[lines].height,
          expanded &&
            "overflow-hidden transition-[height] duration-300 ease-out [interpolate-size:allow-keywords]",
        )}
        ref={ref}
      >
        <Linkify>{content}</Linkify>
      </p>
      {clamped && overflowing ? (
        <Button
          className="relative z-[1] h-auto self-start p-0 text-[0.8125rem] font-bold text-brand-ink"
          onClick={() => setExpanded(true)}
          type="button"
          variant="link"
        >
          続きを読む
        </Button>
      ) : null}
    </>
  );
}
