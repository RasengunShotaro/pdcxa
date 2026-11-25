"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BackLink } from "@/feature/pd/components/detail/back-link";
import { avatarInitials } from "@/feature/pd/components/timeline/avatar-initials";
import { AppearancePreferencesSync } from "@/feature/settings/components/appearance-preferences-sync";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";
import { AppBackdrop } from "./app-backdrop/app-backdrop";
import { AppSheetsProvider, useAppSheets } from "./app-sheets";
import styles from "./app-shell.module.css";
import { AppSidebarNav } from "./app-sidebar-nav";
import { FeedTabs } from "./feed-tabs";
import { LiquidGlass } from "./liquid-glass/liquid-glass";
import { MobileBar } from "./mobile-bar";
import {
  TIMELINE_TABS,
  殻の見出しを決める,
  画面の種類を決める,
} from "./nav-items";
import { NavUser } from "./nav-user";
import { 今日の日付を見出しにする } from "./today-label";

interface AppShellProps {
  children: ReactNode;
  userFooter?: ReactNode;
  backdrop?: ReactNode;
}

function MobileSettingsButton() {
  const { user } = useCurrentUser();
  const { openSheet } = useAppSheets();
  const displayName = user?.fullName ?? "ユーザー";

  return (
    <button
      aria-label="設定"
      className={styles.me}
      onClick={() => openSheet("settings")}
      type="button"
    >
      <Avatar className="size-10">
        <AvatarImage alt="" src={user?.imageUrl} />
        <AvatarFallback className="bg-surface-solid text-sm font-bold text-ink">
          {avatarInitials(displayName)}
        </AvatarFallback>
      </Avatar>
    </button>
  );
}

export function AppShell({
  children,
  userFooter = <NavUser />,
  backdrop = <AppBackdrop />,
}: AppShellProps) {
  const pathname = usePathname();
  const screen = 画面の種類を決める(pathname);
  const heading = 殻の見出しを決める(pathname);

  return (
    <div className={cn("app-ambient", styles.app)} data-screen={screen}>
      {backdrop}
      <AppearancePreferencesSync />
      <AppSheetsProvider>
        <a
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-surface-solid focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink focus:shadow-md"
          href="#main-content"
        >
          コンテンツへスキップ
        </a>

        <div className={styles.frame}>
          <Link className={styles.brand} href="/">
            <Image
              alt="PDCXA"
              className={styles.logo}
              height={32}
              priority
              src="/pdcxa.svg"
              unoptimized
              width={118}
            />
          </Link>
          <MobileSettingsButton />

          <header className={styles.tools}>
            {screen === "page" || screen === "user" ? (
              heading ? (
                <h1 className={styles.title}>{heading}</h1>
              ) : null
            ) : (
              <>
                <h1 className="sr-only">{heading}</h1>
                <div className={styles.tabs}>
                  <FeedTabs tabs={TIMELINE_TABS} />
                </div>
              </>
            )}
            <div className={styles.back}>
              <BackLink withLabel />
            </div>
            <p className={styles.today} suppressHydrationWarning>
              {今日の日付を見出しにする(new Date())}
            </p>
          </header>

          <div className={styles.rail}>
            <LiquidGlass bezel={22} radius={24} strength={80} />
            <AppSidebarNav />
            <div className={styles.railEnd}>{userFooter}</div>
          </div>

          <div
            className={cn(styles.surface, "surface-material")}
            id="main-content"
          >
            {children}
          </div>
        </div>

        <MobileBar />
      </AppSheetsProvider>
    </div>
  );
}
