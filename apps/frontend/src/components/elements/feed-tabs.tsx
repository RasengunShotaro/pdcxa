"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ViewTransition } from "react";
import { cn } from "@/lib/utils";
import {
  type FeedTab,
  isNavItemActive,
  タブを切り替える向き,
} from "./nav-items";

interface FeedTabsProps {
  tabs: readonly FeedTab[];
}

export function FeedTabs({ tabs }: FeedTabsProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="タイムラインの切り替え" className="flex h-full flex-1">
      {tabs.map(({ href, label }) => {
        const isCurrent = isNavItemActive({ pathname, href });
        const direction = タブを切り替える向き({ tabs, pathname, href });
        return (
          <Link
            aria-current={isCurrent ? "page" : undefined}
            className={cn(
              "relative flex flex-1 items-center justify-center text-base outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary-500/50 focus-visible:ring-inset",
              isCurrent
                ? "font-semibold text-foreground"
                : "font-medium text-muted-foreground hover:text-foreground",
            )}
            href={href}
            key={href}
            transitionTypes={direction ? [direction] : undefined}
          >
            <span className="relative flex h-full items-center">
              {label}
              {isCurrent ? (
                <ViewTransition
                  default="none"
                  name="feed-tab-indicator"
                  share="feed-tab-indicator"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-1 rounded-full bg-primary-500"
                  />
                </ViewTransition>
              ) : null}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
