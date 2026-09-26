"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
      <span className="inline-flex h-9 items-center pr-2 pl-1 text-sm text-muted-foreground tabular-nums">
        0
      </span>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          aria-label="いいねした人を表示"
          className="h-9 rounded-full pr-2.5 pl-1 text-sm text-muted-foreground tabular-nums hover:bg-transparent dark:hover:bg-transparent"
          type="button"
          variant="ghost"
        >
          {likeCount}
        </Button>
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
              <Avatar className="size-8 shrink-0">
                <AvatarImage alt="" src={user.imageUrl} />
                <AvatarFallback className="text-xs font-medium text-muted-foreground">
                  {avatarInitials(user.userFullName)}
                </AvatarFallback>
              </Avatar>
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
