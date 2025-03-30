import { Home, MessageSquare, Bell, User } from "lucide-react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const menuItems = [
    { href: "/", label: "ホーム", icon: Home },
    { href: "/messages", label: "メッセージ", icon: MessageSquare },
    { href: "/notifications", label: "通知", icon: Bell },
    { href: "/profile", label: "プロフィール", icon: User },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center space-x-3 p-2 hover:bg-accent rounded-md transition-colors"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
