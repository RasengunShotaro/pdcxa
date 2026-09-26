"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Linkify } from "@/components/ui/linkify";
import { cn } from "@/lib/utils";

interface PdBodyProps {
  content: string;
  clamp?: boolean;
}

export function PdBody({ content, clamp = true }: PdBodyProps) {
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
          "whitespace-pre-wrap break-words text-sm text-body",
          clamped && "line-clamp-8",
        )}
        ref={ref}
      >
        <Linkify>{content}</Linkify>
      </p>
      {clamped && overflowing ? (
        <Button
          className="h-auto self-start p-0 text-sm text-primary-600 dark:text-primary-300"
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
