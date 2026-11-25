import { MessageSquare } from "lucide-react";
import Link from "next/link";
import type { Pd } from "@/feature/pd/types";
import { 件数を短く表す } from "@/feature/pd/utils/format-count";
import { cn } from "@/lib/utils";
import { PD_ACTION_CLASS, PD_ACTION_ICON_CLASS } from "./pd-action-style";
import { PdBookmarkButton } from "./pd-bookmark-button";
import { PdLikeButton } from "./pd-like-button";
import { PdLikersPopover } from "./pd-likers-popover";
import { PdQuoteButton } from "./pd-quote-button";

interface PdActionsProps {
  pd: Pd;
  className?: string;
}

export function PdActions({ pd, className }: PdActionsProps) {
  return (
    <div
      className={cn(
        "relative z-[1] -ml-2.5 flex items-center gap-1 text-ink-3",
        className,
      )}
    >
      <Link
        aria-label={`${pd.replyCount}件の返信を見る`}
        className={cn(
          PD_ACTION_CLASS,
          "inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        )}
        href={`/pd/${pd.id}`}
      >
        <MessageSquare aria-hidden="true" className={PD_ACTION_ICON_CLASS} />
        {件数を短く表す(pd.replyCount)}
      </Link>
      <PdQuoteButton pd={pd} />
      <div className="inline-flex items-center rounded-[18px] transition-colors hover:bg-fill">
        <PdLikeButton pd={pd} />
        <PdLikersPopover likeCount={pd.likeCount} likeUsers={pd.likeUsers} />
      </div>
      <div className="ml-auto">
        <PdBookmarkButton pd={pd} />
      </div>
    </div>
  );
}
