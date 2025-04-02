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
      <main className="flex flex-col items-center min-h-screen p-4">
        <div className="w-full max-w-2xl">
          ご指定のPDが見つかりませんでした。
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center min-h-screen p-4">
      <div className="w-full max-w-2xl">
        <PdItem pd={pd} />
      </div>
    </main>
  );
}
