"use client";

import { MessageSquare } from "lucide-react";
import { EmptyState } from "@/components/elements/empty-state";
import { PdTimeline } from "@/feature/pd/components/timeline/pd-timeline";
import { usePd } from "@/hooks/use-pd";
import { UserTimelineHeader } from "./user-timeline-header";

interface UserTimelineViewProps {
  userName: string;
}

export function UserTimelineView({ userName }: UserTimelineViewProps) {
  const { pds } = usePd({ userName });
  const detail = pds[0]?.userDetail;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <UserTimelineHeader
        imageUrl={detail?.imageUrl}
        userFullName={detail?.userFullName}
        userName={userName}
      />
      <PdTimeline
        emptyState={
          <EmptyState
            icon={<MessageSquare aria-hidden="true" className="size-8" />}
            message="まだ投稿がありません"
          />
        }
        userName={userName}
      />
    </div>
  );
}
