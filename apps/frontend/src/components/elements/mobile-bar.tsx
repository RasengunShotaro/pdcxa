"use client";

import { BarChart3, Home, Plus, Settings, UserPlus } from "lucide-react";
import { m } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppearancePreferences } from "@/feature/settings/hooks/use-appearance-preferences";
import { useAppSheets } from "./app-sheets";
import styles from "./app-shell.module.css";
import { GLASS_SELECTION_SPRING } from "./glass-selection";
import { LiquidGlass } from "./liquid-glass/liquid-glass";
import { 下部ナビを縮めるか } from "./mobile-bar-compact";
import { 画面の種類を決める } from "./nav-items";

function useCompactOnScroll(enabled: boolean): boolean {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let previousY = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      setCompact((current) =>
        下部ナビを縮めるか({ previousY, currentY, compact: current }),
      );
      previousY = currentY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enabled]);

  return enabled && compact;
}

export function MobileBar() {
  const pathname = usePathname();
  const { openSheet, openComposer } = useAppSheets();
  const { settings } = useAppearancePreferences();
  const compact = useCompactOnScroll(!settings.reduceMotion);
  const screen = 画面の種類を決める(pathname);
  const isHome = screen === "timeline" || screen === "detail";
  const isStats = pathname === "/stats";
  const selection = (
    <m.span
      aria-hidden="true"
      className={styles.selection}
      layoutId="mobile-bar-selection"
      transition={GLASS_SELECTION_SPRING}
    />
  );

  return (
    <>
      <div aria-hidden="true" className={styles.mobileEdge} />
      <div className={styles.mobileBar} data-compact={compact}>
        <nav aria-label="メインナビゲーション" className={styles.mobileNav}>
          <LiquidGlass bezel={18} radius={31} strength={60} />
          <Link
            aria-current={isHome ? "page" : undefined}
            className={styles.mobileItem}
            href="/"
          >
            {isHome ? selection : null}
            <Home aria-hidden="true" />
            <span className={styles.mobileLabel}>ホーム</span>
          </Link>
          <Link
            aria-current={isStats ? "page" : undefined}
            className={styles.mobileItem}
            href="/stats"
          >
            {isStats ? selection : null}
            <BarChart3 aria-hidden="true" />
            <span className={styles.mobileLabel}>統計</span>
          </Link>
          <button
            className={styles.mobileItem}
            onClick={() => openSheet("invitation")}
            type="button"
          >
            <UserPlus aria-hidden="true" />
            <span className={styles.mobileLabel}>招待</span>
          </button>
          <button
            className={styles.mobileItem}
            onClick={() => openSheet("settings")}
            type="button"
          >
            <Settings aria-hidden="true" />
            <span className={styles.mobileLabel}>設定</span>
          </button>
        </nav>
        <button
          aria-label="PDする"
          className={styles.compose}
          onClick={openComposer}
          type="button"
        >
          <Plus aria-hidden="true" />
        </button>
      </div>
    </>
  );
}
