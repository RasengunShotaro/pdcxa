"use client";

import { CursorPagination } from "@/components/ui/cursor-pagination";
import PdItem from "@/feature/pd/components/pd/pd-item";
import { PdItemSkeleton } from "@/feature/pd/components/pd/pd-item-skeleton";
import { useLegacy待ち } from "@/hooks/use-legacy-ready";
import { usePd } from "@/hooks/use-pd";
import { Like } from "./pd-like";

interface UserPageProps {
  userId: string;
}

export function UserPdTimeLine({ userId }: UserPageProps) {
  const isLegacy待機完了 = useLegacy待ち();
  const { pds, isPending, isFetchingNextPage, hasNextPage, fetchNextPage } =
    usePd({ userName: userId });

  if (!isLegacy待機完了 || isPending) {
    return <PdItemSkeleton PD数={5} />;
  }

  return (
    <div className="flex-auto max-w-2xl">
      <div className="space-y-4">
        {pds.map((pd) => (
          <PdItem key={pd.id} like={<Like pd={pd} userId={userId} />} pd={pd} />
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        <CursorPagination
          hasNextPage={hasNextPage}
          isLoading={isFetchingNextPage}
          onNextPage={() => fetchNextPage()}
        />
      </div>
    </div>
  );
}
