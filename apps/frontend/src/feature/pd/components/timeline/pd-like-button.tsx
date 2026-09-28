"use client";

import { Heart } from "lucide-react";
import { PopOnActivate } from "@/components/elements/pop-on-activate";
import { Button } from "@/components/ui/button";
import type { Pd } from "@/feature/pd/types";
import { usePdLike } from "@/hooks/use-pd-like";
import { cn } from "@/lib/utils";

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
      className="h-8 w-auto rounded-full pr-1.5 pl-2.5 hover:bg-transparent dark:hover:bg-transparent"
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
            "size-4.5 transition-[color,fill] duration-150",
            isLiked ? "fill-primary text-primary" : "text-muted-foreground",
          )}
        />
      </PopOnActivate>
    </Button>
  );
}
