import type { ReactNode } from "react";

interface FeedLayoutProps {
  children: ReactNode;
  aside?: ReactNode;
}

export function FeedLayout({ children, aside }: FeedLayoutProps) {
  return (
    <div
      className="-mx-4 -my-6 grid flex-1 grid-cols-1 2xl:grid-cols-[minmax(0,1fr)_600px_minmax(0,1fr)]"
      data-feed-layout=""
    >
      <div className="mx-auto flex w-full min-w-0 max-w-[600px] flex-col bg-card sm:border-x sm:border-border 2xl:col-start-2">
        {children}
      </div>
      {aside ? (
        <aside className="hidden min-w-0 pt-6 pl-6 2xl:block">
          <div className="sticky top-6 w-full max-w-[250px]">{aside}</div>
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
