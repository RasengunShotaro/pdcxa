"use client";

import PdItem from "@/feature/pd/components/Pd/pd-item";
import { PostPdButton } from "@/feature/pd/components/Pd/post-pd-button";
import { usePd } from "@/hooks/use-pd";

export function PdTimeLine() {
  const { pds } = usePd();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-4">
        {pds.map((post) => (
          <PdItem key={post.id} pd={post} />
        ))}
      </div>
      <PostPdButton />
    </div>
  );
}
