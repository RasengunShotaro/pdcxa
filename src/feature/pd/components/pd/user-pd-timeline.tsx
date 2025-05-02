"use client";

import PdItem from "@/feature/pd/components/pd/pd-item";
import { PdItemSkeleton } from "@/feature/pd/components/pd/pd-item-skeleton";
import { usePd } from "@/hooks/use-pd";

interface UserPageProps {
  userId: string;
}

export function UserPdTimeLine({ userId }: UserPageProps) {
  const { pds, isPending } = usePd({ userId });

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
