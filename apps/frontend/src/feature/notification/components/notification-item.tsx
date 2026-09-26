import { Heart, type LucideIcon, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { avatarInitials } from "@/feature/pd/components/timeline/avatar-initials";
import {
  formatAbsoluteDateTime,
  formatDateTime,
} from "@/feature/pd/utils/format-datetime";
import type {
  NotificationItem as NotificationItemType,
  NotificationKind,
} from "../types";
import {
  行為者の表示名,
  通知のリンク先,
  通知の行為文言,
} from "../utils/notification-display";

const KIND_ICON: Record<NotificationKind, LucideIcon> = {
  pdLike: Heart,
  rePdLike: Heart,
  rePd: MessageSquare,
};

interface NotificationItemProps {
  item: NotificationItemType;
  onSelect?: () => void;
  variant?: "cards" | "rows";
}

const ITEM_CLASS_NAME: Record<"cards" | "rows", string> = {
  cards:
    "flex items-start gap-3 rounded-xl border bg-card px-5 py-4 shadow-sm transition-[box-shadow,background-color] hover:bg-muted/40 hover:shadow-md",
  rows: "flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/50",
};

export function NotificationItem({
  item,
  onSelect,
  variant = "cards",
}: NotificationItemProps) {
  const displayName = 行為者の表示名(item.actor);
  const Icon = KIND_ICON[item.kind];

  return (
    <Link
      className={ITEM_CLASS_NAME[variant]}
      href={通知のリンク先(item)}
      onClick={onSelect}
    >
      <Avatar className="size-10 shrink-0">
        <AvatarImage alt="" src={item.actor.imageUrl} />
        <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
          {avatarInitials(displayName)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p className="text-base text-body">
          <span className="font-semibold text-foreground">{displayName}</span>
          <span className="text-muted-foreground">
            さんが{通知の行為文言(item.kind)}
          </span>
        </p>
        <p className="mt-0.5 truncate text-sm text-muted-foreground">
          「{item.excerpt}」
        </p>
        <time
          className="mt-1 block text-xs text-muted-foreground"
          dateTime={item.createdAt}
          suppressHydrationWarning
          title={formatAbsoluteDateTime(item.createdAt)}
        >
          {formatDateTime(item.createdAt)}
        </time>
      </div>

      <Icon
        aria-hidden="true"
        className="mt-1 size-5 shrink-0 text-muted-foreground"
      />
    </Link>
  );
}
