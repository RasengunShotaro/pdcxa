"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUnreadCount } from "@/feature/notification/hooks/use-unread-count";
import {
  isNavItemActive,
  type NavItem,
  PRIMARY_NAV_ITEMS,
  SECONDARY_NAV_ITEMS,
} from "./nav-items";

interface NavItemListProps {
  items: readonly NavItem[];
  pathname: string;
  unreadCount: number;
  onNavigate: () => void;
}

function NavItemList({
  items,
  pathname,
  unreadCount,
  onNavigate,
}: NavItemListProps) {
  return (
    <SidebarMenu className="gap-1 group-data-[collapsible=icon]:items-center">
      {items.map(({ href, label, icon: Icon }) => {
        const active = isNavItemActive({ pathname, href });
        const showUnread = href === "/notifications" && unreadCount > 0;
        return (
          <SidebarMenuItem key={href}>
            <SidebarMenuButton
              asChild
              className="relative h-10 gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-body transition-[color,background-color,translate] hover:-translate-y-px hover:bg-muted active:translate-y-0 data-[active=true]:bg-primary-50 data-[active=true]:font-medium data-[active=true]:text-primary-600 group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0! dark:data-[active=true]:bg-primary/15 dark:data-[active=true]:text-primary-300 [&>svg]:size-5"
              isActive={active}
              tooltip={label}
            >
              <Link
                aria-current={active ? "page" : undefined}
                href={href}
                onClick={onNavigate}
              >
                <Icon aria-hidden="true" />
                <span className="inline-flex items-center gap-1.5 group-data-[collapsible=icon]:hidden">
                  {label}
                  {showUnread ? (
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-50 px-1.5 text-xs font-medium text-red-600 dark:bg-red-500/15 dark:text-red-300">
                      {unreadCount > 99 ? "99+" : unreadCount}
                      <span className="sr-only">件の未読の通知</span>
                    </span>
                  ) : null}
                </span>
                {showUnread ? (
                  <span
                    aria-hidden="true"
                    className="absolute top-1 right-1 hidden size-2.5 rounded-full border-2 border-sidebar bg-red-500 group-data-[collapsible=icon]:block"
                  />
                ) : null}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

export function AppSidebarNav() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const unreadCount = useUnreadCount();

  const closeOnMobile = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <nav
      aria-label="メインナビゲーション"
      className="flex flex-col px-3 py-4 group-data-[collapsible=icon]:px-0"
    >
      <NavItemList
        items={PRIMARY_NAV_ITEMS}
        onNavigate={closeOnMobile}
        pathname={pathname}
        unreadCount={unreadCount}
      />
      <div className="mx-1 my-2 border-t border-sidebar-border group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:w-8" />
      <NavItemList
        items={SECONDARY_NAV_ITEMS}
        onNavigate={closeOnMobile}
        pathname={pathname}
        unreadCount={unreadCount}
      />
    </nav>
  );
}
