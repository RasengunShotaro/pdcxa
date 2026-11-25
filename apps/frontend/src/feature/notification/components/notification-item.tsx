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
    "flex items-start gap-3.5 rounded-2xl bg-fill px-5 py-4 transition-colors hover:bg-fill-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
  rows: "relative flex items-start gap-3.5 rounded-2xl px-3.5 py-4 transition-colors before:pointer-events-none before:absolute before:top-0 before:right-3.5 before:left-[64px] before:h-px before:bg-line hover:bg-row-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/50 group-first/row:before:hidden",
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
      <Avatar className="size-9 shrink-0">
        <AvatarImage alt="" src={item.actor.imageUrl} />
        <AvatarFallback className="bg-brand-soft text-xs font-bold text-ink">
          {avatarInitials(displayName)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 break-words text-[0.9375rem] leading-[1.7] text-ink">
          <span className="font-bold">{displayName}</span>
          <span>さんが{通知の行為文言(item.kind)}</span>
        </p>
        <p className="truncate text-[0.8438rem] leading-[1.6] text-ink-3">
          「{item.excerpt}」
        </p>
        <time
          className="mt-0.5 block text-[0.8125rem] text-ink-3 tabular-nums"
          dateTime={item.createdAt}
          suppressHydrationWarning
          title={formatAbsoluteDateTime(item.createdAt)}
        >
          {formatDateTime(item.createdAt)}
        </time>
      </div>

      <Icon aria-hidden="true" className="mt-1 size-4 shrink-0 text-ink-3" />
    </Link>
  );
}
