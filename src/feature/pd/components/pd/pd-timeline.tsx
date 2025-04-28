"use client";

import PdItem from "@/feature/pd/components/pd/pd-item";
import { PdItemSkeleton } from "@/feature/pd/components/pd/pd-item-skeleton";
import { PostPdButton } from "@/feature/pd/components/pd/post-pd-button";
import { usePd } from "@/hooks/use-pd";

export function PdTimeLine() {
  const { pds, isPending } = usePd();

  if (isPending) {
    return <PdItemSkeleton PD数={5} />;
  }

  return (
    <div className="flex-auto max-w-2xl">
      <div className="space-y-4">
        {pds.map((post) => (
          <PdItem key={post.id} pd={post} />
        ))}
      </div>
      <PostPdButton />
    </div>
  );
}
