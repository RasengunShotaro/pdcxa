"use client";

import { Bookmark } from "lucide-react";
import { EmptyState } from "@/components/elements/empty-state";
import { useBookmarkedPds } from "@/hooks/use-bookmarked-pds";
import { PdList } from "../timeline/pd-list";

export function BookmarksView() {
  const {
    pds,
    isPending,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useBookmarkedPds();

  return (
    <PdList
      density="compact"
      emptyState={
        <EmptyState
          icon={<Bookmark aria-hidden="true" className="size-8" />}
          message="保存した PD はまだありません。PD の右下のしおりから保存できます"
        />
      }
      error={error}
      hasNextPage={hasNextPage}
      highlightsOpenPd
      isError={isError}
      isFetchingNextPage={isFetchingNextPage}
      isPending={isPending}
      onLoadMore={() => fetchNextPage()}
      onRetry={() => refetch()}
      pds={pds}
    />
  );
}
