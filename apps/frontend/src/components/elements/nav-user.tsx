"use client";

import { ChevronsUpDown, LogOut, Settings, UserCog } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { avatarInitials } from "@/feature/pd/components/timeline/avatar-initials";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { useSignOut } from "@/lib/auth/use-sign-out";
import { useAppSheets } from "./app-sheets";
import styles from "./app-shell.module.css";

export function NavUser() {
  const { user } = useCurrentUser();
  const { signOut } = useSignOut();
  const { openSheet } = useAppSheets();

  const displayName = user?.fullName ?? "ユーザー";
  const avatar = (
    <Avatar className="size-8 shrink-0">
      <AvatarImage alt="" src={user?.imageUrl} />
      <AvatarFallback className="bg-brand-soft text-xs font-bold text-ink">
        {avatarInitials(displayName)}
      </AvatarFallback>
    </Avatar>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label={displayName}
          className={styles.profile}
          type="button"
        >
          {avatar}
          <span className={styles.profileText}>
            <span className={styles.profileName}>{displayName}</span>
            {user?.userName ? (
              <span className={styles.profileHandle}>@{user.userName}</span>
            ) : null}
          </span>
          <ChevronsUpDown
            aria-hidden="true"
            className={styles.profileChevron}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-2xl p-1.5"
        side="top"
        sideOffset={8}
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-2 text-left text-sm">
            {avatar}
            <span className="flex-1 truncate font-bold">{displayName}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="rounded-[10px]"
            onSelect={() => openSheet("profile")}
          >
            <UserCog />
            プロフィール設定
          </DropdownMenuItem>
          <DropdownMenuItem
            className="rounded-[10px]"
            onSelect={() => openSheet("settings")}
          >
            <Settings />
            設定
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="rounded-[10px]" onClick={() => signOut()}>
          <LogOut />
          ログアウト
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
