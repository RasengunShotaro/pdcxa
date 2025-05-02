"use client";

import PdItem from "@/feature/pd/components/pd/pd-item";
import { PdItemSkeleton } from "@/feature/pd/components/pd/pd-item-skeleton";
import { PostRePdButton } from "@/feature/pd/components/repd/post-repd-button";
import { RePdList } from "@/feature/pd/components/repd/repd-list";
import { usePd } from "@/hooks/use-pd";
import { useRePd } from "@/hooks/use-repd";

interface PdDetailProps {
  pdId: string;
}

export function PdDetail({ pdId }: PdDetailProps) {
  const { pds, isPending, error } = usePd({ pdId });
  const pd = pds[0];
  const { rePds } = useRePd(pdId);

  if (isPending) {
    return <PdItemSkeleton PD数={1} />;
  }

  if (error) {
    return (
      <div className="flex-auto max-w-2xl">
        ご指定のPDが見つかりませんでした。
      </div>
    );
  }

  return (
    <div className="flex-auto max-w-2xl">
      <PdItem pd={pd} />
      <div className="mt-4 space-y-4">
        <RePdList rePds={rePds} />
      </div>
      <PostRePdButton pdId={pd.id} />
    </div>
  );
}
