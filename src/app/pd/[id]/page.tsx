"use client";

import PdItem from "@/feature/pd/components/Pd/PdItem";
import { PostRePdButton } from "@/feature/pd/components/RePd/PostRePdButton";
import { RePds } from "@/feature/pd/components/RePd/RePDs";
import { usePd } from "@/hooks/usePd";
import { useRePd } from "@/hooks/useRePd";
import { use } from "react";

interface PdDetailProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PdDetail({ params }: PdDetailProps) {
  const unwrapParams = use(params);

  const { pds } = usePd([unwrapParams.id]);
  const pd = pds[0];
  const { rePds } = useRePd(unwrapParams.id);

  if (!pd) {
    return (
      <div className="max-w-2xl mx-auto">
        ご指定のPDが見つかりませんでした。
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <PdItem pd={pd} />
      <div className="mt-4 space-y-4">
        <RePds rePds={rePds} />
      </div>
      <PostRePdButton pdId={pd.id} />
    </div>
  );
}
