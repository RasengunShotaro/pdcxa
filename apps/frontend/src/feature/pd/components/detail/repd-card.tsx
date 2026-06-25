import { Card } from "@/components/ui/card";
import { Linkify } from "@/components/ui/linkify";
import type { RePd } from "@/feature/pd/types";
import { PdAuthor } from "../timeline/pd-author";
import { PdLikersPopover } from "../timeline/pd-likers-popover";
import { RePdLikeButton } from "./repd-like-button";

interface RePdCardProps {
  rePd: RePd;
}

export function RePdCard({ rePd }: RePdCardProps) {
  return (
    <article>
      <Card className="gap-2 px-4 py-4 transition-shadow hover:shadow-md">
        <PdAuthor
          createdAt={rePd.createdAt}
          imageUrl={rePd.userDetail.imageUrl}
          userFullName={rePd.userDetail.userFullName}
          userName={rePd.userDetail.userName}
        />

        <p className="whitespace-pre-wrap break-words text-base text-body">
          <Linkify>{rePd.content}</Linkify>
        </p>

        <div className="flex items-center justify-end pt-1 text-muted-foreground">
          <div className="flex items-center rounded-full transition-colors hover:bg-accent">
            <RePdLikeButton rePd={rePd} />
            <PdLikersPopover
              likeCount={rePd.likeCount}
              likeUsers={rePd.likeUsers}
            />
          </div>
        </div>
      </Card>
    </article>
  );
}
