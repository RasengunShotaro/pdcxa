"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { 画面の種類を決める } from "./nav-items";

const PANE_SCROLL_CLASS =
  "min-h-0 min-w-0 [scrollbar-color:var(--line)_transparent] [scrollbar-width:thin] wide:overflow-y-auto wide:overscroll-contain";

interface FeedSurfaceProps {
  list: ReactNode;
  children: ReactNode;
}

export function FeedSurface({ list, children }: FeedSurfaceProps) {
  const pathname = usePathname();
  const view = 画面の種類を決める(pathname) === "detail" ? "detail" : "list";

  return (
    <div
      className="group/feed grid min-h-0 min-w-0 flex-1 wide:grid-cols-[var(--list-width,400px)_minmax(0,1fr)]"
      data-view={view}
    >
      <section
        aria-label="タイムライン"
        className={`${PANE_SCROLL_CLASS} py-2 max-wide:pb-28 max-wide:group-data-[view=detail]/feed:hidden`}
      >
        {list}
      </section>
      <div
        className={`${PANE_SCROLL_CLASS} flex flex-col border-line px-6 pt-6 wide:border-l max-wide:min-h-[calc(100dvh-140px)] max-wide:px-4 max-wide:pt-4 max-wide:group-data-[view=list]/feed:hidden`}
      >
        {children}
      </div>
    </div>
  );
}

interface SinglePaneProps {
  children: ReactNode;
}

export function SinglePane({ children }: SinglePaneProps) {
  return (
    <div className={`${PANE_SCROLL_CLASS} flex-1 p-6 max-wide:p-4`}>
      <div className="max-wide:pb-28">{children}</div>
    </div>
  );
}

interface FeedSectionHeadingProps {
  children: ReactNode;
}

export function FeedSectionHeading({ children }: FeedSectionHeadingProps) {
  return (
    <h2 className="mt-[26px] flex items-baseline gap-2 text-[1rem] leading-normal font-bold text-ink">
      {children}
    </h2>
  );
}
