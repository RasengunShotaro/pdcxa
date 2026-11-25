import Link from "next/link";
import type { Pd } from "@/feature/pd/types";
import { cn } from "@/lib/utils";
import { PdActions } from "./pd-actions";
import { PdAuthorLine, PdAvatar } from "./pd-author";
import { PdBody } from "./pd-body";
import { PdCardImage } from "./pd-card-image";
import { PdTimestamp } from "./pd-timestamp";
import { QuotedPdCard } from "./quoted-pd-card";

interface PdCardProps {
  pd: Pd;
  showAuthor?: boolean;
  density?: "compact" | "comfortable";
  selected?: boolean;
}

export function PdCard({
  pd,
  showAuthor = true,
  density = "comfortable",
  selected = false,
}: PdCardProps) {
  const detailHref = `/pd/${pd.id}`;
  const isCompact = density === "compact";

  return (
    <article
      className={cn(
        "relative flex gap-3 rounded-2xl px-3.5 py-3.5 transition-colors before:pointer-events-none before:absolute before:top-0 before:right-3.5 before:h-px before:bg-line hover:bg-row-hover group-first/row:before:hidden",
        showAuthor ? "before:left-[66px]" : "before:left-3.5",
        selected &&
          "wide:bg-fill-hover wide:before:hidden wide:hover:bg-fill-hover",
      )}
      data-selected={selected}
    >
      <Link
        aria-hidden="true"
        className="absolute inset-0 rounded-[inherit]"
        href={detailHref}
        tabIndex={-1}
      />
      {showAuthor ? (
        <PdAvatar
          imageUrl={pd.userDetail.imageUrl}
          userFullName={pd.userDetail.userFullName}
          userName={pd.userDetail.userName}
        />
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        {showAuthor ? (
          <PdAuthorLine
            badges={pd.userDetail.badges}
            createdAt={pd.createdAt}
            href={detailHref}
            userFullName={pd.userDetail.userFullName}
            userName={pd.userDetail.userName}
          />
        ) : (
          <PdTimestamp
            className="relative z-[1] self-start text-[0.8125rem] text-ink-3 tabular-nums"
            createdAt={pd.createdAt}
            href={detailHref}
          />
        )}

        <PdBody
          className={cn(
            "mt-1",
            isCompact
              ? "text-[0.9063rem] leading-[1.7]"
              : "text-[0.9688rem] leading-[1.85]",
          )}
          content={pd.content}
        />

        <PdCardImage
          alt={`${pd.userDetail.userFullName}さんが投稿した画像`}
          imageFileName={pd.imageFileName}
          shape={isCompact ? "row" : "wide"}
        />

        {pd.quotedPd ? <QuotedPdCard quotedPd={pd.quotedPd} /> : null}

        <PdActions className="mt-2" pd={pd} />
      </div>
    </article>
  );
}
