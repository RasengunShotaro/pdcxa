"use client";

import { MessageCirclePlus, MessageSquare } from "lucide-react";
import type { ReactNode } from "react";
import { EmptyState } from "@/components/elements/empty-state";
import { Button } from "@/components/ui/button";
import { usePd } from "@/hooks/use-pd";
import { PdList } from "./pd-list";

interface PdTimelineProps {
  userName?: string;
  onCompose?: () => void;
  emptyState?: ReactNode;
  showAuthor?: boolean;
  density?: "compact" | "comfortable";
  highlightsOpenPd?: boolean;
}

export function PdTimeline({
  userName,
  onCompose,
  emptyState,
  showAuthor = true,
  density = "comfortable",
  highlightsOpenPd = false,
}: PdTimelineProps) {
  const {
    pds,
    isPending,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = usePd({ userName });

  return (
    <PdList
      density={density}
      emptyState={
        emptyState ?? (
          <EmptyState
            action={
              onCompose ? (
                <Button
                  className="rounded-full"
                  onClick={onCompose}
                  type="button"
                >
                  <MessageCirclePlus aria-hidden="true" className="size-4" />
                  最初のPDをしてみよう
                </Button>
              ) : undefined
            }
            icon={<MessageSquare aria-hidden="true" className="size-8" />}
            message="まだPDがありません"
          />
        )
      }
      error={error}
      hasNextPage={hasNextPage}
      highlightsOpenPd={highlightsOpenPd}
      isError={isError}
      isFetchingNextPage={isFetchingNextPage}
      isPending={isPending}
      onLoadMore={() => fetchNextPage()}
      onRetry={() => refetch()}
      pds={pds}
      showAuthor={showAuthor}
    />
  );
}
