"use client";

import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ListError } from "@/components/elements/list-error";
import { ListSkeleton } from "@/components/elements/list-skeleton";
import { Button } from "@/components/ui/button";
import type { Pd } from "@/feature/pd/types";
import { InsertedListItem } from "./inserted-list-item";
import { PdCard } from "./pd-card";
import { 選択中のPDを決める } from "./selected-pd";
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
  density?: "compact" | "comfortable";
  highlightsOpenPd?: boolean;
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
  density = "comfortable",
  highlightsOpenPd = false,
}: PdListProps) {
  const pathname = usePathname();
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
  const selectedPdId = highlightsOpenPd
    ? 選択中のPDを決める({ pathname, firstPdId: pds[0]?.id })
    : undefined;

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
      <ul className="px-2">
        {pds.map((pd) => (
          <InsertedListItem isInserted={insertedIds.has(pd.id)} key={pd.id}>
            <PdCard
              density={density}
              pd={pd}
              selected={pd.id === selectedPdId}
              showAuthor={showAuthor}
            />
          </InsertedListItem>
        ))}
      </ul>

      <div aria-hidden="true" ref={sentinelRef} />

      {hasNextPage ? (
        <div className="flex justify-center py-4">
          <Button
            className="rounded-full"
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
