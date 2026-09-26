"use client";

import { MessagesSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebarNav } from "./app-sidebar-nav";
import { ColorModeSwitcher } from "./color-mode-switcher";
import { pageLabelForPath } from "./nav-items";
import { NavUser } from "./nav-user";
import { NotificationBell } from "./notification-bell";

interface AppShellProps {
  children: ReactNode;
  userFooter?: ReactNode;
  headerActions?: ReactNode;
}

export function AppShell({
  children,
  userFooter = <NavUser />,
  headerActions = <NotificationBell />,
}: AppShellProps) {
  const pathname = usePathname();
  const currentLabel = pageLabelForPath(pathname);

  return (
    <SidebarProvider>
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-sidebar focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary focus:shadow-md"
        href="#main-content"
      >
        コンテンツへスキップ
      </a>

      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="transition-[color,background-color,transform] hover:-translate-y-px active:translate-y-0"
                size="lg"
                tooltip="PDCXA"
              >
                <Link href="/">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <MessagesSquare className="size-4" />
                  </div>
                  <Image
                    alt="PDCXA"
                    className="h-7 w-auto group-data-[collapsible=icon]:hidden dark:invert"
                    height={28}
                    priority
                    src="/pdcxa.svg"
                    unoptimized
                    width={103}
                  />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <AppSidebarNav />
        </SidebarContent>
        <SidebarFooter>{userFooter}</SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 max-md:size-11" />
            {currentLabel ? (
              <>
                <Separator
                  className="mx-1 data-[orientation=vertical]:h-6"
                  orientation="vertical"
                />
                <span className="text-base font-medium">{currentLabel}</span>
              </>
            ) : null}
          </div>
          <div className="ml-auto flex items-center gap-1 px-4">
            {headerActions}
            <ColorModeSwitcher />
          </div>
        </header>
        <div className="flex flex-1 flex-col overflow-y-auto bg-bg-page">
          <div
            className="mx-auto w-full max-w-[1042px] px-4 py-6"
            id="main-content"
          >
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
