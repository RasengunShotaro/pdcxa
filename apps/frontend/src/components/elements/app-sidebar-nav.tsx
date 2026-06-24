"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { isNavItemActive, NAV_ITEMS } from "./nav-items";

export function AppSidebarNav() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const closeOnMobile = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sm">メニュー</SidebarGroupLabel>
      <nav aria-label="メインナビゲーション">
        <SidebarMenu className="gap-1.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isNavItemActive({ pathname, href });
            return (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton
                  asChild
                  className="h-11 text-base transition-[color,background-color,transform] hover:-translate-y-px active:translate-y-0 data-[active=true]:bg-primary/10 data-[active=true]:text-primary [&>svg]:size-5"
                  isActive={active}
                  tooltip={label}
                >
                  <Link
                    aria-current={active ? "page" : undefined}
                    href={href}
                    onClick={closeOnMobile}
                  >
                    <Icon />
                    <span>{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </nav>
    </SidebarGroup>
  );
}
