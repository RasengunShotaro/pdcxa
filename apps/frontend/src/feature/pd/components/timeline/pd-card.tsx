import { MessageSquare } from "lucide-react";
import Link from "next/link";
import type { Pd } from "@/feature/pd/types";
import { 件数を短く表す } from "@/feature/pd/utils/format-count";
import { PdAuthorLine, PdAvatar } from "./pd-author";
import { PdBody } from "./pd-body";
import { PdBookmarkButton } from "./pd-bookmark-button";
import { PdCardImage } from "./pd-card-image";
import { PdLikeButton } from "./pd-like-button";
import { PdLikersPopover } from "./pd-likers-popover";
import { PdQuoteButton } from "./pd-quote-button";
import { PdTimestamp } from "./pd-timestamp";
import { QuotedPdCard } from "./quoted-pd-card";

interface PdCardProps {
  pd: Pd;
  showAuthor?: boolean;
  clampBody?: boolean;
}

export function PdCard({
  pd,
  showAuthor = true,
  clampBody = true,
}: PdCardProps) {
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

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        {showAuthor ? (
          <PdAuthorLine
            createdAt={pd.createdAt}
            href={detailHref}
            userFullName={pd.userDetail.userFullName}
            userName={pd.userDetail.userName}
          />
        ) : null}

        <PdBody clamp={clampBody} content={pd.content} />

        <PdCardImage
          alt={`${pd.userDetail.userFullName}さんが投稿した画像`}
          imageFileName={pd.imageFileName}
        />

        {pd.quotedPd ? <QuotedPdCard quotedPd={pd.quotedPd} /> : null}

        <div className="-ml-2 mt-0.5 flex items-center text-muted-foreground">
          {showAuthor ? null : (
            <PdTimestamp
              className="mr-2 ml-2"
              createdAt={pd.createdAt}
              href={detailHref}
            />
          )}
          <div className="w-1/4">
            <Link
              aria-label={`${pd.replyCount}件の返信を見る`}
              className="inline-flex h-8 items-center gap-1.5 rounded-full px-2 text-xs tabular-nums transition-[color,background-color,translate] hover:-translate-y-px hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              href={detailHref}
            >
              <MessageSquare aria-hidden="true" className="size-4.5" />
              {件数を短く表す(pd.replyCount)}
            </Link>
          </div>
          <div className="w-1/4">
            <PdQuoteButton pd={pd} />
          </div>
          <div className="w-1/4">
            <div className="inline-flex items-center rounded-full transition-colors hover:bg-accent">
              <PdLikeButton pd={pd} />
              <PdLikersPopover
                likeCount={pd.likeCount}
                likeUsers={pd.likeUsers}
              />
            </div>
          </div>
          <div className="ml-auto">
            <PdBookmarkButton pd={pd} />
          </div>
        </div>
      </div>
    </article>
  );
}
