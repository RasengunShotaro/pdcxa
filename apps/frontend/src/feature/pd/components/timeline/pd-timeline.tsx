"use client";

import { Loader2, MessageCirclePlus, MessageSquare } from "lucide-react";
import { EmptyState } from "@/components/elements/empty-state";
import { ListError } from "@/components/elements/list-error";
import { ListSkeleton } from "@/components/elements/list-skeleton";
import { Button } from "@/components/ui/button";
import { usePd } from "@/hooks/use-pd";
import { PdCard } from "./pd-card";
import { useInfiniteScroll } from "./use-infinite-scroll";

interface PdTimelineProps {
  onCompose?: () => void;
}

export function PdTimeline({ onCompose }: PdTimelineProps) {
  const {
    pds,
    isPending,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = usePd({});

  const sentinelRef = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    onLoadMore: fetchNextPage,
  });

  if (isPending && pds.length === 0) {
    return <ListSkeleton count={4} />;
  }

  if (isError && pds.length === 0) {
    return <ListError error={error} onRetry={() => refetch()} />;
  }

  if (pds.length === 0) {
    return (
      <EmptyState
        action={
          onCompose ? (
            <Button onClick={onCompose} type="button">
              <MessageCirclePlus aria-hidden="true" className="size-4" />
              最初の PD をしてみよう
            </Button>
          ) : undefined
        }
        icon={<MessageSquare aria-hidden="true" className="size-8" />}
        message="まだ PD がありません"
      />
    );
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-4">
        {pds.map((pd) => (
          <li key={pd.id}>
            <PdCard pd={pd} />
          </li>
        ))}
      </ul>

      <div aria-hidden="true" ref={sentinelRef} />

      {hasNextPage ? (
        <div className="flex justify-center pb-4">
          <Button
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
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
