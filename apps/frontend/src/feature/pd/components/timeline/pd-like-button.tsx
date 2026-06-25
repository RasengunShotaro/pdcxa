"use client";

import { Heart } from "lucide-react";
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
      className="h-9 w-auto rounded-full pr-1.5 pl-2.5"
      disabled={pd.isMyPd || isPending}
      onClick={() => toggleLike()}
      size="icon"
      type="button"
      variant="ghost"
    >
      <Heart
        aria-hidden="true"
        className={cn(
          "size-5 transition-transform duration-150 motion-reduce:transition-none",
          isLiked
            ? "scale-110 fill-primary text-primary"
            : "scale-100 text-muted-foreground",
        )}
      />
    </Button>
  );
}
