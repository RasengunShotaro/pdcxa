import type { Pd } from "@/feature/pd/types";
import { 著者の名前を決める } from "@/feature/pd/utils/author-display";
import { formatAbsoluteDateTime } from "@/feature/pd/utils/format-datetime";
import { UserBadges } from "@/feature/user/badges/user-badges";
import { PdActions } from "../timeline/pd-actions";
import { PdAuthorName, PdAvatar } from "../timeline/pd-author";
import { PdBody } from "../timeline/pd-body";
import { PdCardImage } from "../timeline/pd-card-image";
import { QuotedPdCard } from "../timeline/quoted-pd-card";

interface PdDetailCardProps {
  pd: Pd;
}

export function PdDetailCard({ pd }: PdDetailCardProps) {
  const { userDetail } = pd;
  const { handle } = 著者の名前を決める(userDetail);

  return (
    <article className="flex flex-col">
      <header className="flex items-center gap-3.5">
        <PdAvatar
          imageUrl={userDetail.imageUrl}
          size="detail"
          userFullName={userDetail.userFullName}
          userName={userDetail.userName}
        />
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <PdAuthorName
              className="text-[1.0625rem] leading-[1.4]"
              userFullName={userDetail.userFullName}
              userName={userDetail.userName}
            />
            <UserBadges badgeIds={userDetail.badges} />
          </div>
          {handle ? (
            <p className="truncate text-[0.8125rem] leading-[1.4] text-ink-3">
              @{handle}
            </p>
          ) : null}
        </div>
      </header>

      <PdBody
        className="mt-5 text-[1.3125rem] leading-[1.9] max-wide:text-[1.125rem] max-wide:leading-[1.85]"
        clamp={false}
        content={pd.content}
      />

      <PdCardImage
        alt={`${userDetail.userFullName}さんが投稿した画像`}
        imageFileName={pd.imageFileName}
        shape="wide"
      />

      {pd.quotedPd ? (
        <div className="mt-2">
          <QuotedPdCard quotedPd={pd.quotedPd} />
        </div>
      ) : null}

      <p className="mt-[18px] text-[0.8125rem] text-ink-3 tabular-nums">
        <time dateTime={pd.createdAt} suppressHydrationWarning>
          {formatAbsoluteDateTime(pd.createdAt)}
        </time>
      </p>

      <PdActions className="mt-2.5 border-b border-line pb-2.5" pd={pd} />
    </article>
  );
}
