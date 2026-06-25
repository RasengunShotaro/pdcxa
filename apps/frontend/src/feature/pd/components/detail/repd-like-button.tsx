"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RePd } from "@/feature/pd/types";
import { useRePdLike } from "@/hooks/use-repd-like";
import { cn } from "@/lib/utils";

interface RePdLikeButtonProps {
  rePd: RePd;
}

export function RePdLikeButton({ rePd }: RePdLikeButtonProps) {
  const { isLiked, toggleLike, isPending } = useRePdLike(rePd);

  const label = rePd.isMyRePd
    ? "自分の返信にはいいねできません"
    : `${rePd.likeCount}件のいいね、${isLiked ? "いいね済み" : "未いいね"}`;

  return (
    <Button
      aria-label={label}
      aria-pressed={isLiked}
      className="h-11 w-auto rounded-full pr-1.5 pl-2.5"
      disabled={rePd.isMyRePd || isPending}
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
