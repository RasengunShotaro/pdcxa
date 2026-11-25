"use client";

import { MessageSquare } from "lucide-react";
import { EmptyState } from "@/components/elements/empty-state";
import { BackLink } from "@/feature/pd/components/detail/back-link";
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
    <div className="w-full">
      <header className="flex items-center gap-2 px-3.5 pb-2">
        <BackLink />
        <h1 className="truncate text-[1.125rem] leading-[1.4] font-bold text-ink">
          {detail?.userFullName || `@${userName}`}
        </h1>
      </header>
      <UserTimelineHeader
        badges={detail?.badges}
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
        highlightsOpenPd
        showAuthor={false}
        userName={userName}
      />
    </div>
  );
}
