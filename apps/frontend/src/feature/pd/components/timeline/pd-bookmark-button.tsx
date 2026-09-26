"use client";

import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Pd } from "@/feature/pd/types";
import { usePdBookmark } from "@/hooks/use-pd-bookmark";
import { cn } from "@/lib/utils";

interface PdBookmarkButtonProps {
  pd: Pd;
}

export function PdBookmarkButton({ pd }: PdBookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = usePdBookmark({ pd });

  return (
    <Button
      aria-label={isBookmarked ? "保存を外す" : "保存する"}
      aria-pressed={isBookmarked}
      className="size-9 rounded-full text-muted-foreground transition-[color,background-color,translate] hover:-translate-y-px hover:bg-accent"
      onClick={toggleBookmark}
      size="icon"
      title={isBookmarked ? "保存を外す" : "保存する"}
      type="button"
      variant="ghost"
    >
      <Bookmark
        aria-hidden="true"
        className={cn(
          "size-[18px]",
          isBookmarked &&
            "fill-primary-600 text-primary-600 dark:fill-primary-300 dark:text-primary-300",
        )}
      />
    </Button>
  );
}
