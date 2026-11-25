"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ViewTransition } from "react";
import { useUnreadCount } from "@/feature/notification/hooks/use-unread-count";
import { cn } from "@/lib/utils";
import { LiquidGlass } from "./liquid-glass/liquid-glass";
import {
  type FeedTab,
  isNavItemActive,
  タブを切り替える向き,
} from "./nav-items";
import { UnreadBadge } from "./unread-badge";

interface FeedTabsProps {
  tabs: readonly FeedTab[];
}

export function FeedTabs({ tabs }: FeedTabsProps) {
  const pathname = usePathname();
  const unreadCount = useUnreadCount();

  return (
    <nav
      aria-label="タイムラインの切り替え"
      className="relative isolate inline-flex gap-0.5 rounded-[22px] p-1"
    >
      <LiquidGlass bezel={14} radius={22} strength={52} />
      {tabs.map(({ href, label }) => {
        const isCurrent = isNavItemActive({ pathname, href });
        const direction = タブを切り替える向き({ tabs, pathname, href });
        return (
          <Link
            aria-current={isCurrent ? "page" : undefined}
            className={cn(
              "relative inline-flex h-9 min-w-[84px] items-center justify-center rounded-[18px] px-4 text-[0.875rem] leading-none font-bold whitespace-nowrap text-ink outline-none transition-[background-color,scale] focus-visible:ring-2 focus-visible:ring-brand-ink active:scale-[1.05] active:glass-press-glow",
              isCurrent ? null : "hover:bg-(--glass-hover)",
            )}
            href={href}
            key={href}
            scroll={false}
            transitionTypes={direction ? [direction] : undefined}
          >
            {isCurrent ? (
              <ViewTransition
                default="none"
                name="feed-tab-indicator"
                share="feed-tab-indicator"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-[18px] bg-selected selected-pill dark:shadow-none"
                />
              </ViewTransition>
            ) : null}
            <span className="relative inline-flex items-center gap-1.5">
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
