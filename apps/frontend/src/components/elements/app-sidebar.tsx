import { BarChart3, Home, Mail, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NextLinkLoader } from "./next-link-loader";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const menuItems = [
    { href: "/", label: "ホーム", icon: Home },
    { href: "/profile", label: "プロフィール", icon: User },
    { href: "/stats", label: "統計", icon: BarChart3 },
    { href: "/invitation", label: "招待", icon: Mail },
  ];

  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link href="/">
                <Image
                  alt="Logo"
                  className="h-7 w-auto dark:invert"
                  height={40}
                  quality={100}
                  src="/pdcxa.svg"
                  width={140}
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Web Version</span>
                  <span className="truncate text-xs text-muted-foreground">
                    respect to K.S.
                  </span>
                </div>
                <NextLinkLoader />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    className="flex items-center space-x-3 gap-2 px-4"
                  >
                    <Link href={item.href} key={item.href}>
                      <NextLinkLoader
                        className="h-4 w-4"
                        fallback={<item.icon className="h-4 w-4" />}
                      />
                      <span className="text-base">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
