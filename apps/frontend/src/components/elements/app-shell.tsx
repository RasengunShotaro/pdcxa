"use client";

import { MessagesSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebarNav } from "./app-sidebar-nav";
import { pageLabelForPath } from "./nav-items";
import { NavUser } from "./nav-user";
import { SidebarCollapseButton } from "./sidebar-collapse-button";

interface AppShellProps {
  children: ReactNode;
  userFooter?: ReactNode;
}

function BrandLink() {
  return (
    <Link
      className="flex items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      href="/"
    >
      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        <MessagesSquare aria-hidden="true" className="size-4" />
      </span>
      <Image
        alt="PDCXA"
        className="h-5 w-auto group-data-[collapsible=icon]:hidden dark:invert"
        height={20}
        priority
        src="/pdcxa.svg"
        unoptimized
        width={74}
      />
    </Link>
  );
}

export function AppShell({
  children,
  userFooter = <NavUser />,
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
        <SidebarHeader className="h-16 justify-center border-b border-sidebar-border px-4 group-data-[collapsible=icon]:px-2">
          <BrandLink />
        </SidebarHeader>
        <SidebarContent>
          <AppSidebarNav />
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border">
          <SidebarCollapseButton />
          {userFooter}
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset className="min-w-0">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-2 md:hidden">
          <SidebarTrigger className="size-11" />
          <BrandLink />
        </header>
        <div className="flex flex-1 flex-col overflow-y-auto bg-bg-page">
          <div
            className="mx-auto flex w-full max-w-[65.125rem] flex-1 flex-col px-4 py-6 has-[[data-narrow-page]]:max-w-[37.5rem] has-[[data-feed-layout]]:max-w-none has-[[data-feed-layout]]:[&>[data-page-title]]:hidden"
            id="main-content"
          >
            {currentLabel ? (
              <h1
                className="mb-6 text-2xl font-bold text-foreground"
                data-page-title=""
              >
                {currentLabel}
              </h1>
            ) : null}
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
