import type { ReactNode } from "react";

interface FeedLayoutProps {
  children: ReactNode;
  aside?: ReactNode;
}

export function FeedLayout({ children, aside }: FeedLayoutProps) {
  return (
    <div className="-mx-4 -my-6 flex flex-1 justify-center gap-6 sm:mx-0">
      <div className="flex w-full min-w-0 max-w-[600px] flex-col bg-card sm:border-x sm:border-border">
        {children}
      </div>
      {aside ? (
        <aside className="hidden w-[300px] shrink-0 pt-6 lg:block">
          <div className="sticky top-6">{aside}</div>
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
