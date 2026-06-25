"use client";

import { EmptyState } from "@/components/elements/empty-state";
import { ListError } from "@/components/elements/list-error";
import { ListSkeleton } from "@/components/elements/list-skeleton";
import type { RePd } from "@/feature/pd/types";
import { RePdCard } from "./repd-card";

interface RePdSectionProps {
  rePds: RePd[];
  isPending: boolean;
  isError: boolean;
  error: unknown;
  onRetry: () => void;
}

export function RePdSection({
  rePds,
  isPending,
  isError,
  error,
  onRetry,
}: RePdSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="font-bold text-foreground text-xl">
        RePD 一覧
        {!isPending && !isError ? (
          <span className="ml-2 text-base text-muted-foreground tabular-nums">
            {rePds.length}
          </span>
        ) : null}
      </h2>

      {isPending ? <ListSkeleton count={2} /> : null}

      {isError ? <ListError error={error} onRetry={onRetry} /> : null}

      {!isPending && !isError && rePds.length === 0 ? (
        <EmptyState message="まだ RePD はありません。RePD してみよう!" />
      ) : null}

      {!isPending && !isError && rePds.length > 0 ? (
        <div className="space-y-4">
          {rePds.map((rePd) => (
            <RePdCard key={rePd.id} rePd={rePd} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
