"use client";

import { ChevronsUpDown, LogOut, Palette, UserCog } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { avatarInitials } from "@/feature/pd/components/timeline/avatar-initials";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { useSignOut } from "@/lib/auth/use-sign-out";

const THEME_OPTIONS = [
  { value: "light", label: "ライト" },
  { value: "dark", label: "ダーク" },
  { value: "system", label: "システムに合わせる" },
] as const;

export function NavUser() {
  const { user } = useCurrentUser();
  const { signOut } = useSignOut();
  const { isMobile } = useSidebar();
  const { theme, setTheme } = useTheme();

  const displayName = user?.fullName ?? "ユーザー";
  const avatar = (
    <Avatar className="size-8 shrink-0">
      <AvatarImage alt="" src={user?.imageUrl} />
      <AvatarFallback className="bg-primary-50 text-xs font-medium text-primary-600 dark:bg-primary/15 dark:text-primary-300">
        {avatarInitials(displayName)}
      </AvatarFallback>
    </Avatar>
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className="h-14 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              size="lg"
              tooltip={displayName}
            >
              {avatar}
              <span className="flex min-w-0 flex-1 flex-col text-left leading-snug">
                <span className="truncate text-sm font-medium text-foreground">
                  {displayName}
                </span>
                {user?.userName ? (
                  <span className="truncate text-xs text-muted-foreground">
                    @{user.userName}
                  </span>
                ) : null}
              </span>
              <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex items-center gap-2 text-left text-sm">
                {avatar}
                <span className="flex-1 truncate font-medium">
                  {displayName}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <UserCog />
                  プロフィール設定
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="flex items-center gap-2 text-xs font-normal text-muted-foreground">
              <Palette aria-hidden="true" className="size-4" />
              テーマ
            </DropdownMenuLabel>
            <DropdownMenuRadioGroup onValueChange={setTheme} value={theme}>
              {THEME_OPTIONS.map((option) => (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut />
              ログアウト
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
