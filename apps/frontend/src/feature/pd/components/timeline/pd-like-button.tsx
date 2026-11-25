"use client";

import { Heart } from "lucide-react";
import { PopOnActivate } from "@/components/elements/pop-on-activate";
import { Button } from "@/components/ui/button";
import type { Pd } from "@/feature/pd/types";
import { usePdLike } from "@/hooks/use-pd-like";
import { cn } from "@/lib/utils";
import {
  PD_ACTION_ICON_CLASS,
  PD_ACTION_PRESSED_ICON_CLASS,
} from "./pd-action-style";

interface PdLikeButtonProps {
  pd: Pd;
}

export function PdLikeButton({ pd }: PdLikeButtonProps) {
  const { isLiked, toggleLike, isPending } = usePdLike({ pd });

  const label = pd.isMyPd
    ? "自分の投稿にはいいねできません"
    : `${pd.likeCount}件のいいね、${isLiked ? "いいね済み" : "未いいね"}`;

  return (
    <Button
      aria-label={label}
      aria-pressed={isLiked}
      className="h-9 w-auto rounded-[18px] pr-1.5 pl-2.5 hover:bg-transparent dark:hover:bg-transparent"
      disabled={pd.isMyPd || isPending}
      onClick={() => toggleLike()}
      size="icon"
      type="button"
      variant="ghost"
    >
      <PopOnActivate active={isLiked} ripple>
        <Heart
          aria-hidden="true"
          className={cn(
            PD_ACTION_ICON_CLASS,
            "transition-[color,fill] duration-150",
            isLiked ? PD_ACTION_PRESSED_ICON_CLASS : "text-ink-3",
          )}
        />
      </PopOnActivate>
    </Button>
  );
}
