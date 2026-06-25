"use client";

import { ChevronsUpDown, LogOut, UserCog } from "lucide-react";
import Link from "next/link";
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
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { avatarInitials } from "@/feature/pd/components/timeline/avatar-initials";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { useSignOut } from "@/lib/auth/use-sign-out";

export function NavUser() {
  const { user } = useCurrentUser();
  const { signOut } = useSignOut();
  const { isMobile } = useSidebar();

  const displayName = user?.fullName ?? "ユーザー";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              size="lg"
            >
              <Avatar className="size-8 rounded-lg">
                <AvatarImage alt={displayName} src={user?.imageUrl} />
                <AvatarFallback className="rounded-lg">
                  {avatarInitials(displayName)}
                </AvatarFallback>
              </Avatar>
              <span className="flex-1 truncate text-left text-sm font-medium">
                {displayName}
              </span>
              <ChevronsUpDown className="ml-auto size-4" />
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
                <Avatar className="size-8 rounded-lg">
                  <AvatarImage alt={displayName} src={user?.imageUrl} />
                  <AvatarFallback className="rounded-lg">
                    {avatarInitials(displayName)}
                  </AvatarFallback>
                </Avatar>
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
