import { Linkify } from "@/components/ui/linkify";
import type { RePd } from "@/feature/pd/types";
import { PdAuthorLine, PdAvatar } from "../timeline/pd-author";
import { PdLikersPopover } from "../timeline/pd-likers-popover";
import { RePdLikeButton } from "./repd-like-button";

interface RePdCardProps {
  rePd: RePd;
}

export function RePdCard({ rePd }: RePdCardProps) {
  return (
    <article className="flex gap-3 px-4 pt-3 pb-1">
      <PdAvatar
        imageUrl={rePd.userDetail.imageUrl}
        userFullName={rePd.userDetail.userFullName}
        userName={rePd.userDetail.userName}
      />

      <div className="min-w-0 flex-1 space-y-1">
        <PdAuthorLine
          createdAt={rePd.createdAt}
          userFullName={rePd.userDetail.userFullName}
          userName={rePd.userDetail.userName}
        />

        <p className="whitespace-pre-wrap break-words text-sm text-body">
          <Linkify>{rePd.content}</Linkify>
        </p>

        <div className="-ml-2 flex items-center text-muted-foreground">
          <div className="inline-flex items-center rounded-full transition-colors hover:bg-accent">
            <RePdLikeButton rePd={rePd} />
            <PdLikersPopover
              likeCount={rePd.likeCount}
              likeUsers={rePd.likeUsers}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
