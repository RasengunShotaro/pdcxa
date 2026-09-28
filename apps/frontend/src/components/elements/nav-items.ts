import {
  BarChart3,
  Bell,
  Bookmark,
  Home,
  type LucideIcon,
  User,
  UserPlus,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const PRIMARY_NAV_ITEMS: readonly NavItem[] = [
  { href: "/", label: "ホーム", icon: Home },
  { href: "/notifications", label: "通知", icon: Bell },
  { href: "/bookmarks", label: "保存した PD", icon: Bookmark },
  { href: "/profile", label: "プロフィール", icon: User },
];

export const SECONDARY_NAV_ITEMS: readonly NavItem[] = [
  { href: "/stats", label: "統計", icon: BarChart3 },
  { href: "/invitation", label: "招待", icon: UserPlus },
];

export const NAV_ITEMS: readonly NavItem[] = [
  ...PRIMARY_NAV_ITEMS,
  ...SECONDARY_NAV_ITEMS,
];

export interface FeedTab {
  href: string;
  label: string;
}

export const TIMELINE_TABS: readonly FeedTab[] = [
  { href: "/", label: "ホーム" },
  { href: "/notifications", label: "通知" },
];

export type TabDirection = "tab-forward" | "tab-back";

interface TabDirectionInput {
  tabs: readonly FeedTab[];
  pathname: string;
  href: string;
}

export const タブを切り替える向き = ({
  tabs,
  pathname,
  href,
}: TabDirectionInput): TabDirection | undefined => {
  const currentIndex = tabs.findIndex((tab) =>
    isNavItemActive({ pathname, href: tab.href }),
  );
  const nextIndex = tabs.findIndex((tab) => tab.href === href);
  if (currentIndex === -1 || nextIndex === -1 || currentIndex === nextIndex) {
    return undefined;
  }
  return nextIndex > currentIndex ? "tab-forward" : "tab-back";
};

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
