"use client";

import { CursorPagination } from "@/components/ui/cursor-pagination";
import PdItem from "@/feature/pd/components/pd/pd-item";
import { PdItemSkeleton } from "@/feature/pd/components/pd/pd-item-skeleton";
import { PostPdButton } from "@/feature/pd/components/pd/post-pd-button";
import { usePd } from "@/hooks/use-pd";
import { Like } from "./pd-like";

export function PdTimeLine() {
  const { pds, isPending, isFetchingNextPage, hasNextPage, fetchNextPage } =
    usePd({});

  if (isPending) {
    return <PdItemSkeleton PD数={5} />;
  }

  return (
    <div className="flex-auto max-w-2xl">
      <div className="space-y-4">
        {pds.map((pd) => (
          <PdItem key={pd.id} pd={pd} like={<Like pd={pd} />} />
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        <CursorPagination
          hasNextPage={hasNextPage}
          isLoading={isFetchingNextPage}
          onNextPage={() => fetchNextPage()}
        />
      </div>
      <PostPdButton />
    </div>
  );
}
