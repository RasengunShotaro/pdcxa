"use client";

import PdItem from "@/feature/pd/components/pd/pd-item";
import { PdItemSkeleton } from "@/feature/pd/components/pd/pd-item-skeleton";
import { usePd } from "@/hooks/use-pd";
import { use } from "react";

interface UserPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function UserPage({ params }: UserPageProps) {
  const unwrapParams = use(params);

  const { pds, isPending } = usePd({ userId: unwrapParams.id });

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
    </div>
  );
}
