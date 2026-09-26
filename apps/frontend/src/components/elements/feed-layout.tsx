"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { pageLabelForPath } from "./nav-items";

interface FeedLayoutProps {
  children: ReactNode;
  aside?: ReactNode;
  title?: string;
  leading?: ReactNode;
}

export function FeedLayout({
  children,
  aside,
  title,
  leading,
}: FeedLayoutProps) {
  const pathname = usePathname();
  const heading = title ?? pageLabelForPath(pathname);

  return (
    <div
      className="-mx-4 -my-6 grid flex-1 grid-cols-[1fr_minmax(0,42rem)_1fr]"
      data-feed-layout=""
    >
      <div className="col-start-2 flex min-w-0 flex-col bg-card sm:border-x sm:border-border">
        {heading ? (
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-card/90 px-4 backdrop-blur">
            {leading}
            <h1 className="truncate text-[1.25rem] leading-[1.4] font-bold text-foreground">
              {heading}
            </h1>
          </header>
        ) : null}
        {children}
      </div>
      {aside ? (
        <aside className="col-start-3 hidden w-[20.175rem] px-6 pt-6 box-content xl:block">
          <div className="sticky top-6 flex flex-col gap-4">{aside}</div>
        </aside>
      ) : null}
    </div>
  );
}

interface FeedSectionHeadingProps {
  children: ReactNode;
}

export function FeedSectionHeading({ children }: FeedSectionHeadingProps) {
  return (
    <h2 className="flex items-baseline gap-2 border-b border-border px-4 py-3 text-sm font-bold text-foreground">
      {children}
    </h2>
  );
}
