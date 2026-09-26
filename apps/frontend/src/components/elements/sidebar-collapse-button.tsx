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
    <SidebarMenu className="group-data-[collapsible=icon]:items-center">
      <SidebarMenuItem>
        <SidebarMenuButton
          aria-expanded={expanded}
          aria-label={label}
          className="h-10 gap-3 rounded-lg px-4 text-sm font-medium text-slate-500 transition-[color,background-color,translate] hover:-translate-y-px hover:bg-muted active:translate-y-0 group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0! dark:text-slate-400 [&>svg]:size-5"
          onClick={toggleSidebar}
          tooltip={label}
          type="button"
        >
          {expanded ? (
            <PanelLeftClose aria-hidden="true" />
          ) : (
            <PanelLeftOpen aria-hidden="true" />
          )}
          <span className="group-data-[collapsible=icon]:hidden">{label}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
