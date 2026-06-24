import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Linkify } from "@/components/ui/linkify";
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
        <Linkify>{pd.content}</Linkify>
      </p>

      <PdCardImage
        alt={`${pd.userDetail.userFullName}さんが投稿した画像`}
        imageFileName={pd.imageFileName}
      />

      <div className="flex items-center gap-2 pt-1 text-muted-foreground">
        <div className="flex items-center">
          <PdLikeButton pd={pd} />
          <PdLikersPopover likeCount={pd.likeCount} likeUsers={pd.likeUsers} />
        </div>
        <Button
          asChild
          className="h-11 gap-1.5 rounded-full px-3 text-sm text-muted-foreground"
          variant="ghost"
        >
          <Link
            aria-label={`${pd.replyCount}件の返信を見る`}
            href={`/pd/${pd.id}`}
          >
            <MessageSquare aria-hidden="true" className="size-5" />
            <span className="tabular-nums">{pd.replyCount}</span>
          </Link>
        </Button>
      </div>
    </Card>
  );
}
