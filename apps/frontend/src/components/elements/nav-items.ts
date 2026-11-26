import {
  BarChart3,
  Bell,
  Bookmark,
  Home,
  type LucideIcon,
  UserPlus,
} from "lucide-react";
import type { AppSheetKind } from "./app-sheets";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  sheet?: AppSheetKind;
}

export const PRIMARY_NAV_ITEMS: readonly NavItem[] = [
  { href: "/", label: "ホーム", icon: Home },
  { href: "/notifications", label: "通知", icon: Bell },
  { href: "/bookmarks", label: "保存済み", icon: Bookmark },
];

export const SECONDARY_NAV_ITEMS: readonly NavItem[] = [
  { href: "/stats", label: "統計", icon: BarChart3 },
  { href: "/invitation", label: "招待", icon: UserPlus, sheet: "invitation" },
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
  { href: "/bookmarks", label: "保存済み" },
];

const OTHER_PAGE_LABELS: readonly FeedTab[] = [
  { href: "/profile", label: "プロフィール" },
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

export type ScreenKind = "timeline" | "user" | "detail" | "page";

const PD_DETAIL_PREFIX = "/pd/";
const USER_TIMELINE_PREFIX = "/user/";

const 個人のタイムラインか = (pathname: string): boolean =>
  pathname.startsWith(USER_TIMELINE_PREFIX) &&
  pathname.length > USER_TIMELINE_PREFIX.length;

export const 画面の種類を決める = (pathname: string): ScreenKind => {
  if (TIMELINE_TABS.some((tab) => tab.href === pathname)) return "timeline";
  if (個人のタイムラインか(pathname)) return "user";
  if (pathname.startsWith(PD_DETAIL_PREFIX)) return "detail";
  return "page";
};

export const 開いているPDのIDを求める = (pathname: string): string | null => {
  if (!pathname.startsWith(PD_DETAIL_PREFIX)) return null;
  const id = pathname.slice(PD_DETAIL_PREFIX.length).split("/")[0];
  return id ? decodeURIComponent(id) : null;
};

interface ListTabInput {
  pathname: string;
  lastTabHref: string;
}

export const 一覧に出すタブを決める = ({
  pathname,
  lastTabHref,
}: ListTabInput): string => {
  if (個人のタイムラインか(pathname)) return pathname;
  return (
    TIMELINE_TABS.find((tab) => tab.href === pathname)?.href ?? lastTabHref
  );
};

interface BackTabInput {
  pathname: string;
  lastHref: string;
}

export const 個人の一覧から戻る先のタブを決める = ({
  pathname,
  lastHref,
}: BackTabInput): string =>
  TIMELINE_TABS.find((tab) => tab.href === pathname)?.href ?? lastHref;

export const 一覧の持ち主を求める = (listHref: string): string | null =>
  個人のタイムラインか(listHref)
    ? decodeURIComponent(listHref.slice(USER_TIMELINE_PREFIX.length))
    : null;

const DYNAMIC_PAGE_LABELS: readonly { prefix: string; label: string }[] = [
  { prefix: "/pd/", label: "PD詳細" },
  { prefix: "/user/", label: "ユーザー" },
];

export const 殻の見出しを決める = (pathname: string): string | undefined =>
  pathname.startsWith("/user/") ? undefined : pageLabelForPath(pathname);

export const pageLabelForPath = (pathname: string): string | undefined => {
  const page = [...NAV_ITEMS, ...TIMELINE_TABS, ...OTHER_PAGE_LABELS].find(
    (item) => isNavItemActive({ pathname, href: item.href }),
  );
  if (page) {
    return page.label;
  }
  return DYNAMIC_PAGE_LABELS.find((page) => pathname.startsWith(page.prefix))
    ?.label;
};
