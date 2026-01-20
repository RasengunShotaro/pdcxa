"use client";

import PdItem from "@/feature/pd/components/pd/pd-item";
import { PdItemSkeleton } from "@/feature/pd/components/pd/pd-item-skeleton";
import { PostRePdButton } from "@/feature/pd/components/repd/post-repd-button";
import { RePdList } from "@/feature/pd/components/repd/repd-list";
import { useLegacy待ち } from "@/hooks/use-legacy-ready";
import { usePd } from "@/hooks/use-pd";
import { useRePd } from "@/hooks/use-repd";
import { Like } from "./pd-like";

interface PdDetailProps {
  pdId: string;
}

export const PdDetail = ({ pdId }: PdDetailProps) => {
  const isLegacy待機完了 = useLegacy待ち();
  const { pds, isPending, isError } = usePd({ pdId });
  const pd = pds[0];
  const { rePds } = useRePd(pdId);

  if (!isLegacy待機完了 || isPending) {
    return <PdItemSkeleton PD数={1} />;
  }

  if (isError) {
    return (
      <div className="flex-auto max-w-2xl">
        ご指定のPDが見つかりませんでした。
      </div>
    );
  }

  return (
    <div className="flex-auto max-w-2xl">
      <PdItem like={<Like pd={pd} pdId={pdId} />} pd={pd} />
      <div className="mt-4 space-y-4">
        <RePdList rePds={rePds} />
      </div>
      <PostRePdButton pdId={pd.id} />
    </div>
  );
};
