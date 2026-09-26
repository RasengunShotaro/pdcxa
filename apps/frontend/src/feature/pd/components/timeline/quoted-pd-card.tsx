import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { QuotedPd } from "@/feature/pd/types";
import {
  formatAbsoluteDateTime,
  formatDateTime,
} from "@/feature/pd/utils/format-datetime";
import { cn } from "@/lib/utils";
import { avatarInitials } from "./avatar-initials";

interface QuotedPdCardProps {
  quotedPd: QuotedPd;
  linked?: boolean;
}

export function QuotedPdCard({ quotedPd, linked = true }: QuotedPdCardProps) {
  const { userDetail } = quotedPd;
  const body = (
    <>
      <span className="flex min-w-0 items-center gap-1.5 text-sm leading-normal">
        <Avatar className="size-5 shrink-0">
          <AvatarImage alt="" src={userDetail.imageUrl} />
          <AvatarFallback className="bg-primary-50 text-[10px] font-medium text-primary-600 dark:bg-primary/15 dark:text-primary-300">
            {avatarInitials(userDetail.userFullName)}
          </AvatarFallback>
        </Avatar>
        <span className="truncate font-bold text-foreground">
          {userDetail.userFullName}
        </span>
        {userDetail.userName ? (
          <span className="min-w-0 shrink truncate text-muted-foreground">
            @{userDetail.userName}
          </span>
        ) : null}
        <span aria-hidden="true" className="shrink-0 text-muted-foreground">
          ·
        </span>
        <time
          className="shrink-0 text-muted-foreground"
          dateTime={quotedPd.createdAt}
          suppressHydrationWarning
          title={formatAbsoluteDateTime(quotedPd.createdAt)}
        >
          {formatDateTime(quotedPd.createdAt)}
        </time>
      </span>
      <span className="line-clamp-4 whitespace-pre-wrap break-words text-sm text-body">
        {quotedPd.content}
      </span>
    </>
  );

  const className =
    "mt-1 flex flex-col gap-1 rounded-lg border border-border px-3 py-2.5";

  if (!linked) {
    return <div className={className}>{body}</div>;
  }

  return (
    <Link
      className={cn(
        className,
        "transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
      )}
      href={`/pd/${quotedPd.id}`}
    >
      {body}
    </Link>
  );
}
