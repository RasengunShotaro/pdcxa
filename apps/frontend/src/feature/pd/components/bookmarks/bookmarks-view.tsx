"use client";

import { Bookmark } from "lucide-react";
import { EmptyState } from "@/components/elements/empty-state";
import { FeedLayout } from "@/components/elements/feed-layout";
import { WeeklyActivityCard } from "@/feature/pd/components/stats/weekly-activity-card";
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
    <FeedLayout aside={<WeeklyActivityCard />}>
      <PdList
        emptyState={
          <EmptyState
            icon={<Bookmark aria-hidden="true" className="size-8" />}
            message="保存した PD はまだありません。PD の右下のしおりから保存できます"
          />
        }
        error={error}
        hasNextPage={hasNextPage}
        isError={isError}
        isFetchingNextPage={isFetchingNextPage}
        isPending={isPending}
        onLoadMore={() => fetchNextPage()}
        onRetry={() => refetch()}
        pds={pds}
      />
    </FeedLayout>
  );
}
