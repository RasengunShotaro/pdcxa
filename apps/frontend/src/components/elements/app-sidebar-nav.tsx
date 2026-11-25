"use client";

import { PenLine } from "lucide-react";
import { m } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUnreadCount } from "@/feature/notification/hooks/use-unread-count";
import { useAppSheets } from "./app-sheets";
import styles from "./app-shell.module.css";
import { GLASS_SELECTION_SPRING } from "./glass-selection";
import { isNavItemActive, NAV_ITEMS } from "./nav-items";
import { UnreadBadge } from "./unread-badge";

export function AppSidebarNav() {
  const pathname = usePathname();
  const unreadCount = useUnreadCount();
  const { openSheet, openComposer } = useAppSheets();

  return (
    <nav aria-label="メインナビゲーション" className={styles.nav}>
      <button className={styles.write} onClick={openComposer} type="button">
        <PenLine aria-hidden="true" />
        PDする
      </button>
      {NAV_ITEMS.map(({ href, label, icon: Icon, sheet }) => {
        if (sheet) {
          return (
            <button
              className={styles.navItem}
              key={href}
              onClick={() => openSheet(sheet)}
              type="button"
            >
              <Icon aria-hidden="true" />
              {label}
            </button>
          );
        }
        const active = isNavItemActive({ pathname, href });
        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={styles.navItem}
            href={href}
            key={href}
          >
            {active ? (
              <m.span
                aria-hidden="true"
                className={styles.selection}
                layoutId="rail-selection"
                transition={GLASS_SELECTION_SPRING}
              />
            ) : null}
            <Icon aria-hidden="true" />
            <span className={styles.navLabel}>
              {label}
              {href === "/notifications" ? (
                <UnreadBadge count={unreadCount} />
              ) : null}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
