import type { ReactNode } from "react";

interface StatsBlockProps {
  title: string;
  description?: string;
  aside?: ReactNode;
  children: ReactNode;
}

export function StatsBlock({
  title,
  description,
  aside,
  children,
}: StatsBlockProps) {
  return (
    <section className="flex min-w-0 flex-col gap-3.5 border-t border-line pt-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
        <h2 className="text-[1rem] leading-normal font-bold whitespace-nowrap text-ink">
          {title}
        </h2>
        {description ? (
          <p className="text-[0.75rem] text-ink-3">{description}</p>
        ) : null}
        {aside}
      </div>
      {children}
    </section>
  );
}
