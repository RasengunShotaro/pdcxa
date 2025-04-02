"use client";

import PdItem from "@/feature/pd/components/PdItem";
import { usePd } from "@/hooks/usePd";

interface PdDetailProps {
  params: {
    id: string;
  };
}

export default function PdDetail({ params }: PdDetailProps) {
  const { pds } = usePd([params.id]);
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
