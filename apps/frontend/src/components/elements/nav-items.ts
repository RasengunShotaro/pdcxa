import { BarChart3, Bell, Home, type LucideIcon, Mail } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { href: "/", label: "ホーム", icon: Home },
  { href: "/notifications", label: "通知", icon: Bell },
  { href: "/stats", label: "統計", icon: BarChart3 },
  { href: "/invitation", label: "招待", icon: Mail },
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

const DYNAMIC_PAGE_LABELS: readonly { prefix: string; label: string }[] = [
  { prefix: "/pd/", label: "PD詳細" },
  { prefix: "/user/", label: "ユーザー" },
  { prefix: "/profile", label: "プロフィール" },
];

export const pageLabelForPath = (pathname: string): string | undefined => {
  const navItem = NAV_ITEMS.find((item) =>
    isNavItemActive({ pathname, href: item.href }),
  );
  if (navItem) {
    return navItem.label;
  }
  return DYNAMIC_PAGE_LABELS.find((page) => pathname.startsWith(page.prefix))
    ?.label;
};
