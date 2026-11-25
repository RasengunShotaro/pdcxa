import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { QuotedPd } from "@/feature/pd/types";
import { 著者の名前を決める } from "@/feature/pd/utils/author-display";
import {
  formatAbsoluteDateTime,
  formatDateTime,
} from "@/feature/pd/utils/format-datetime";
import { UserBadges } from "@/feature/user/badges/user-badges";
import { cn } from "@/lib/utils";
import { avatarInitials } from "./avatar-initials";

interface QuotedPdCardProps {
  quotedPd: QuotedPd;
  linked?: boolean;
}

export function QuotedPdCard({ quotedPd, linked = true }: QuotedPdCardProps) {
  const { userDetail } = quotedPd;
  const { name, handle } = 著者の名前を決める(userDetail);
  const body = (
    <>
      <span className="flex min-w-0 items-center gap-1.5 text-[0.8125rem] leading-[1.4] text-ink-3">
        <Avatar className="size-5 shrink-0">
          <AvatarImage alt="" src={userDetail.imageUrl} />
          <AvatarFallback className="bg-brand-soft text-[10px] font-bold text-ink">
            {avatarInitials(userDetail.userFullName)}
          </AvatarFallback>
        </Avatar>
        <span className="min-w-0 truncate font-bold text-ink">{name}</span>
        <UserBadges badgeIds={userDetail.badges} focusable={!linked} />
        {handle ? <span className="min-w-0 truncate">@{handle}</span> : null}
        <time
          className="ml-auto shrink-0 tabular-nums"
          dateTime={quotedPd.createdAt}
          suppressHydrationWarning
          title={formatAbsoluteDateTime(quotedPd.createdAt)}
        >
          {formatDateTime(quotedPd.createdAt)}
        </time>
      </span>
      <span className="line-clamp-4 whitespace-pre-wrap break-words text-[0.875rem] leading-[1.7] text-ink-2">
        {quotedPd.content}
      </span>
    </>
  );

  const className =
    "mt-3 flex min-w-0 flex-col gap-0.5 rounded-xl bg-fill px-3 py-2";

  if (!linked) {
    return <div className={className}>{body}</div>;
  }

  return (
    <Link
      className={cn(
        className,
        "relative z-[1] transition-colors hover:bg-fill-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
      )}
      href={`/pd/${quotedPd.id}`}
    >
      {body}
    </Link>
  );
}
