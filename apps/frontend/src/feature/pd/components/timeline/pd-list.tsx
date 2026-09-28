"use client";

import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { ListError } from "@/components/elements/list-error";
import { ListSkeleton } from "@/components/elements/list-skeleton";
import { Button } from "@/components/ui/button";
import type { Pd } from "@/feature/pd/types";
import { InsertedListItem } from "./inserted-list-item";
import { PdCard } from "./pd-card";
import { useInfiniteScroll } from "./use-infinite-scroll";
import { useInsertedRowIds } from "./use-inserted-row-ids";

interface PdListProps {
  pds: Pd[];
  isPending: boolean;
  isError: boolean;
  error: unknown;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  onRetry: () => void;
  emptyState: ReactNode;
  showAuthor?: boolean;
}

export function PdList({
  pds,
  isPending,
  isError,
  error,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  onRetry,
  emptyState,
  showAuthor = true,
}: PdListProps) {
  const sentinelRef = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
  });
  const insertedIds = useInsertedRowIds({
    ids: pds.map((pd) => pd.id),
    isReady: !isPending,
    position: "head",
  });

  if (isPending && pds.length === 0) {
    return <ListSkeleton count={4} variant="rows" />;
  }

  if (isError && pds.length === 0) {
    return (
      <div className="p-4">
        <ListError error={error} onRetry={onRetry} />
      </div>
    );
  }

  if (pds.length === 0) {
    return <>{emptyState}</>;
  }

  return (
    <div>
      <ul className="divide-y divide-border border-b border-border">
        {pds.map((pd) => (
          <InsertedListItem isInserted={insertedIds.has(pd.id)} key={pd.id}>
            <PdCard pd={pd} showAuthor={showAuthor} />
          </InsertedListItem>
        ))}
      </ul>

      <div aria-hidden="true" ref={sentinelRef} />

      {hasNextPage ? (
        <div className="flex justify-center py-4">
          <Button
            disabled={isFetchingNextPage}
            onClick={onLoadMore}
            type="button"
            variant="outline"
          >
            {isFetchingNextPage ? (
              <Loader2 aria-hidden="true" className="size-4 animate-spin" />
            ) : null}
            さらに読む
          </Button>
        </div>
      ) : null}
    </div>
  );
}
