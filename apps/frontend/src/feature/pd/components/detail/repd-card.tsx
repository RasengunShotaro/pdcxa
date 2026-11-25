import type { RePd } from "@/feature/pd/types";
import { PdAuthorLine, PdAvatar } from "../timeline/pd-author";
import { PdBody } from "../timeline/pd-body";
import { PdLikersPopover } from "../timeline/pd-likers-popover";
import { RePdLikeButton } from "./repd-like-button";

interface RePdCardProps {
  rePd: RePd;
}

export function RePdCard({ rePd }: RePdCardProps) {
  return (
    <article className="relative flex gap-3 py-3.5 after:absolute after:top-[54px] after:-bottom-2 after:left-[16.5px] after:hidden after:w-px after:bg-line group-[:not(:last-child)]/row:after:block">
      <PdAvatar
        imageUrl={rePd.userDetail.imageUrl}
        size="reply"
        userFullName={rePd.userDetail.userFullName}
        userName={rePd.userDetail.userName}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <PdAuthorLine
          badges={rePd.userDetail.badges}
          createdAt={rePd.createdAt}
          userFullName={rePd.userDetail.userFullName}
          userName={rePd.userDetail.userName}
        />

        <PdBody className="mt-0.5" content={rePd.content} />

        <div className="-ml-2.5 mt-0.5 flex items-center text-ink-3">
          <div className="inline-flex items-center rounded-[18px] transition-colors hover:bg-fill">
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
