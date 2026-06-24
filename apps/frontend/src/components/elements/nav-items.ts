import { BarChart3, Home, type LucideIcon, Mail, User } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { href: "/", label: "ホーム", icon: Home },
  { href: "/stats", label: "統計", icon: BarChart3 },
  { href: "/invitation", label: "招待", icon: Mail },
  { href: "/profile", label: "プロフィール", icon: User },
];

interface IsNavItemActiveInput {
  pathname: string;
  href: string;
}

export const isNavItemActive = ({
  pathname,
  href,
}: IsNavItemActiveInput): boolean =>
  href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
