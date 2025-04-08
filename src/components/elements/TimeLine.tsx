"use client";

import PdItem from "@/feature/pd/components/Pd/PdItem";
import { PostPdButton } from "@/feature/pd/components/Pd/PostPdButton";
import { usePd } from "@/hooks/usePd";

export function TimeLine() {
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
