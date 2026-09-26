import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { Linkify } from "@/components/ui/linkify";
import type { Pd } from "@/feature/pd/types";
import { PdAuthorLine, PdAvatar } from "./pd-author";
import { PdCardImage } from "./pd-card-image";
import { PdLikeButton } from "./pd-like-button";
import { PdLikersPopover } from "./pd-likers-popover";
import { PdTimestamp } from "./pd-timestamp";

interface PdCardProps {
  pd: Pd;
  showAuthor?: boolean;
}

export function PdCard({ pd, showAuthor = true }: PdCardProps) {
  const detailHref = `/pd/${pd.id}`;

  return (
    <article className="flex gap-3 px-4 pt-3 pb-1">
      {showAuthor ? (
        <PdAvatar
          imageUrl={pd.userDetail.imageUrl}
          userFullName={pd.userDetail.userFullName}
          userName={pd.userDetail.userName}
        />
      ) : null}

      <div className="min-w-0 flex-1 space-y-1">
        {showAuthor ? (
          <PdAuthorLine
            createdAt={pd.createdAt}
            href={detailHref}
            userFullName={pd.userDetail.userFullName}
            userName={pd.userDetail.userName}
          />
        ) : null}

        <p className="whitespace-pre-wrap break-words text-sm text-body">
          <Linkify>{pd.content}</Linkify>
        </p>

        <PdCardImage
          alt={`${pd.userDetail.userFullName}さんが投稿した画像`}
          imageFileName={pd.imageFileName}
        />

        <div className="-ml-2 flex items-center gap-1 text-muted-foreground">
          {showAuthor ? null : (
            <PdTimestamp
              className="mr-2 ml-2"
              createdAt={pd.createdAt}
              href={detailHref}
            />
          )}
          <Link
            aria-label={`${pd.replyCount}件の返信を見る`}
            className="inline-flex h-9 min-w-16 items-center gap-1.5 rounded-full px-2 text-sm tabular-nums transition-[color,background-color,translate] hover:-translate-y-px hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            href={detailHref}
          >
            <MessageCircle aria-hidden="true" className="size-[18px]" />
            {pd.replyCount}
          </Link>
          <div className="flex min-w-16 items-center rounded-full transition-colors hover:bg-accent">
            <PdLikeButton pd={pd} />
            <PdLikersPopover
              likeCount={pd.likeCount}
              likeUsers={pd.likeUsers}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
