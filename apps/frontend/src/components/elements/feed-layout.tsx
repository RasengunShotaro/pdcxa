import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FeedLayoutProps {
  children: ReactNode;
  aside?: ReactNode;
}

export function FeedLayout({ children, aside }: FeedLayoutProps) {
  return (
    <div className="flex justify-center gap-6">
      <div className="w-full min-w-0 max-w-[600px]">{children}</div>
      {aside ? (
        <aside className="hidden w-[300px] shrink-0 lg:block">
          <div className="sticky top-0">{aside}</div>
        </aside>
      ) : null}
    </div>
  );
}

interface FeedPanelProps {
  children: ReactNode;
  className?: string;
}

export function FeedPanel({ children, className }: FeedPanelProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
