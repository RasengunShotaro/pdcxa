"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function SidebarCollapseButton() {
  const { state, toggleSidebar, isMobile } = useSidebar();

  if (isMobile) {
    return null;
  }

  const expanded = state === "expanded";
  const label = expanded ? "サイドバーを閉じる" : "サイドバーを開く";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          aria-expanded={expanded}
          className="h-10 text-sm font-medium text-muted-foreground transition-[color,background-color,translate] hover:-translate-y-px hover:bg-muted active:translate-y-0 [&>svg]:size-5"
          onClick={toggleSidebar}
          tooltip={label}
          type="button"
        >
          {expanded ? (
            <PanelLeftClose aria-hidden="true" />
          ) : (
            <PanelLeftOpen aria-hidden="true" />
          )}
          <span>{label}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
