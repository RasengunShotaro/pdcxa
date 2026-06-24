"use client";

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { UserMenu } from "@/lib/auth/user-menu";

export function NavUser() {
  const { user } = useCurrentUser();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-2 rounded-md p-1.5">
          <UserMenu />
          <span className="flex-1 truncate text-left text-sm font-medium group-data-[collapsible=icon]:hidden">
            {user?.fullName ?? "ユーザー"}
          </span>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
