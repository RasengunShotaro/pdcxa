"use client";

import PdItem from "@/feature/pd/components/PdItem";
import { usePd } from "@/hooks/usePd";
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
    </div>
  );
}
