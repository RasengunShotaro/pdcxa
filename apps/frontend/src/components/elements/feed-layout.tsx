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
    <div className="-mx-4 -my-6 flex flex-1" data-feed-layout="">
      <div className="flex w-full min-w-0 md:ml-[max(1.5rem,calc(50vw-18.75rem-var(--sidebar-width)))] md:group-has-data-[collapsible=icon]/sidebar-wrapper:ml-[max(1.5rem,calc(50vw-18.75rem-var(--sidebar-width-icon)))]">
        <div className="flex w-full min-w-0 max-w-[37.5rem] flex-col bg-card sm:border-x sm:border-border max-md:mx-auto">
          {heading ? (
            <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-card/90 px-4 backdrop-blur">
              {leading}
              <h1 className="truncate text-[1.25rem] leading-snug font-bold text-foreground">
                {heading}
              </h1>
            </header>
          ) : null}
          {children}
        </div>
        {aside ? (
          <aside className="hidden w-[20.25rem] shrink-0 pt-6 pl-6 xl:block">
            <div className="sticky top-6">{aside}</div>
          </aside>
        ) : null}
      </div>
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
