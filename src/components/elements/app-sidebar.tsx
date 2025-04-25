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
import { Home, Mail, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import pdcxa from "../../../static/pdcxa.svg";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const menuItems = [
    { href: "/", label: "ホーム", icon: Home },
    { href: "/profile", label: "プロフィール", icon: User },
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
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <Image
                  src={pdcxa}
                  alt="Logo"
                  className="h-7 w-auto dark:invert"
                  quality={100}
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Web Version</span>
                  <span className="truncate text-xs">respect to K.S.</span>
                </div>
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
                    <Link key={item.href} href={item.href}>
                      <item.icon />
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
