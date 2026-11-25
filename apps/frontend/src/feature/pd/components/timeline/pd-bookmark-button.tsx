"use client";

import { Bookmark } from "lucide-react";
import { PopOnActivate } from "@/components/elements/pop-on-activate";
import { Button } from "@/components/ui/button";
import type { Pd } from "@/feature/pd/types";
import { usePdBookmark } from "@/hooks/use-pd-bookmark";
import { cn } from "@/lib/utils";
import {
  PD_ACTION_CLASS,
  PD_ACTION_ICON_CLASS,
  PD_ACTION_PRESSED_ICON_CLASS,
} from "./pd-action-style";

interface PdBookmarkButtonProps {
  pd: Pd;
}

export function PdBookmarkButton({ pd }: PdBookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = usePdBookmark({ pd });

  return (
    <Button
      aria-label={isBookmarked ? "保存を外す" : "保存する"}
      aria-pressed={isBookmarked}
      className={PD_ACTION_CLASS}
      onClick={toggleBookmark}
      title={isBookmarked ? "保存を外す" : "保存する"}
      type="button"
      variant="ghost"
    >
      <PopOnActivate active={isBookmarked}>
        <Bookmark
          aria-hidden="true"
          className={cn(
            PD_ACTION_ICON_CLASS,
            "transition-[color,fill] duration-150",
            isBookmarked && PD_ACTION_PRESSED_ICON_CLASS,
          )}
        />
      </PopOnActivate>
    </Button>
  );
}
