"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { LikeUser } from "@/feature/pd/types";
import { avatarInitials } from "./avatar-initials";

interface PdLikersPopoverProps {
  likeCount: number;
  likeUsers: LikeUser[];
}

export function PdLikersPopover({
  likeCount,
  likeUsers,
}: PdLikersPopoverProps) {
  if (likeCount === 0) {
    return (
      <span className="text-sm text-muted-foreground tabular-nums">0</span>
    );
  }

  return (
    <Popover>
      <PopoverTrigger
        aria-label="いいねした人を表示"
        className="inline-flex h-8 items-center rounded-md px-2 text-sm text-muted-foreground tabular-nums transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        type="button"
      >
        {likeCount}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 p-2">
        <p className="px-2 py-1.5 text-sm font-medium text-foreground">
          いいねした人
        </p>
        <ul className="max-h-64 space-y-1 overflow-y-auto">
          {likeUsers.map((user) => (
            <li
              className="flex items-center gap-2.5 rounded-md px-2 py-1.5"
              key={user.userId}
            >
              <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
                {user.imageUrl ? (
                  // biome-ignore lint/performance/noImgElement: 外部 (Clerk CDN) のアバター URL を表示するため
                  <img
                    alt=""
                    className="size-full object-cover"
                    src={user.imageUrl}
                  />
                ) : (
                  <span className="text-xs font-medium text-muted-foreground">
                    {avatarInitials(user.userFullName)}
                  </span>
                )}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-foreground">
                  {user.userFullName || "名前未設定"}
                </span>
                {user.userName ? (
                  <span className="block truncate text-xs text-muted-foreground">
                    @{user.userName}
                  </span>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
