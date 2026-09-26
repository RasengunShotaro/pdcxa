"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
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
    <SidebarMenu className="gap-1">
      {items.map(({ href, label, icon: Icon }) => {
        const active = isNavItemActive({ pathname, href });
        return (
          <SidebarMenuItem key={href}>
            <SidebarMenuButton
              asChild
              className="relative h-10 text-sm font-medium text-body transition-[color,background-color,translate] hover:-translate-y-px hover:bg-muted active:translate-y-0 data-[active=true]:bg-primary-50 data-[active=true]:font-medium data-[active=true]:text-primary-600 dark:data-[active=true]:bg-primary/15 dark:data-[active=true]:text-primary-300 [&>svg]:size-5"
              isActive={active}
              tooltip={label}
            >
              <Link
                aria-current={active ? "page" : undefined}
                href={href}
                onClick={onNavigate}
              >
                <Icon />
                <span>{label}</span>
                {href === "/notifications" && unreadCount > 0 ? (
                  <span
                    aria-hidden="true"
                    className="absolute top-1 right-1 hidden size-2.5 rounded-full border-2 border-sidebar bg-red-500 group-data-[collapsible=icon]:block"
                  />
                ) : null}
              </Link>
            </SidebarMenuButton>
            {href === "/notifications" && unreadCount > 0 ? (
              <SidebarMenuBadge className="-translate-y-1/2 bg-red-50 text-red-600 peer-data-[size=default]/menu-button:top-1/2 peer-hover/menu-button:text-red-600 peer-data-[active=true]/menu-button:text-red-600 dark:bg-red-500/15 dark:text-red-300">
                {unreadCount > 99 ? "99+" : unreadCount}
                <span className="sr-only">件の未読の通知</span>
              </SidebarMenuBadge>
            ) : null}
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
    <nav aria-label="メインナビゲーション">
      <SidebarGroup>
        <NavItemList
          items={PRIMARY_NAV_ITEMS}
          onNavigate={closeOnMobile}
          pathname={pathname}
          unreadCount={unreadCount}
        />
      </SidebarGroup>
      <SidebarSeparator className="mx-3 w-auto" />
      <SidebarGroup>
        <NavItemList
          items={SECONDARY_NAV_ITEMS}
          onNavigate={closeOnMobile}
          pathname={pathname}
          unreadCount={unreadCount}
        />
      </SidebarGroup>
    </nav>
  );
}
