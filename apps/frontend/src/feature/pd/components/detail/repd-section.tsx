"use client";

import { EmptyState } from "@/components/elements/empty-state";
import { FeedSectionHeading } from "@/components/elements/feed-layout";
import { ListError } from "@/components/elements/list-error";
import { ListSkeleton } from "@/components/elements/list-skeleton";
import type { RePd } from "@/feature/pd/types";
import { InsertedListItem } from "../timeline/inserted-list-item";
import { useInsertedRowIds } from "../timeline/use-inserted-row-ids";
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
  const insertedIds = useInsertedRowIds({
    ids: rePds.map((rePd) => rePd.id),
    isReady: !isPending && !isError,
    position: "anywhere",
  });

  return (
    <section>
      <FeedSectionHeading>
        RePD一覧
        {!isPending && !isError ? (
          <span className="font-normal text-muted-foreground tabular-nums">
            {rePds.length}
          </span>
        ) : null}
      </FeedSectionHeading>

      {isPending ? <ListSkeleton count={2} variant="rows" /> : null}

      {isError ? (
        <div className="p-4">
          <ListError error={error} onRetry={onRetry} />
        </div>
      ) : null}

      {!isPending && !isError && rePds.length === 0 ? (
        <EmptyState message="まだRePDはありません。RePDしてみよう！" />
      ) : null}

      {!isPending && !isError && rePds.length > 0 ? (
        <ul className="divide-y divide-border border-b border-border">
          {rePds.map((rePd) => (
            <InsertedListItem
              isInserted={insertedIds.has(rePd.id)}
              key={rePd.id}
            >
              <RePdCard rePd={rePd} />
            </InsertedListItem>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
