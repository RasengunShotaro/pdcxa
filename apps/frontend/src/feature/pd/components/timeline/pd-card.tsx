import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { Pd } from "@/feature/pd/types";
import { PdAuthor } from "./pd-author";
import { PdCardImage } from "./pd-card-image";
import { PdLikeButton } from "./pd-like-button";
import { PdLikersPopover } from "./pd-likers-popover";

interface PdCardProps {
  pd: Pd;
}

export function PdCard({ pd }: PdCardProps) {
  return (
    <Card className="gap-3 px-6 py-5 transition-shadow hover:shadow-md">
      <PdAuthor
        createdAt={pd.createdAt}
        imageUrl={pd.userDetail.imageUrl}
        userFullName={pd.userDetail.userFullName}
        userName={pd.userDetail.userName}
      />

      <p className="whitespace-pre-wrap break-words text-base text-body">
        {pd.content}
      </p>

      <PdCardImage
        alt={`${pd.userDetail.userFullName}さんが投稿した画像`}
        imageFileName={pd.imageFileName}
      />

      <div className="flex items-center gap-1 pt-1">
        <PdLikeButton pd={pd} />
        <PdLikersPopover likeCount={pd.likeCount} likeUsers={pd.likeUsers} />
        <Link
          aria-label={`${pd.replyCount}件の返信を見る`}
          className="ml-2 inline-flex h-11 items-center gap-1.5 rounded-full px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          href={`/pd/${pd.id}`}
        >
          <MessageSquare aria-hidden="true" className="size-5" />
          <span className="tabular-nums">{pd.replyCount}</span>
        </Link>
      </div>
    </Card>
  );
}
