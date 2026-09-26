"use client";

import { MessageSquare } from "lucide-react";
import { EmptyState } from "@/components/elements/empty-state";
import { FeedLayout } from "@/components/elements/feed-layout";
import { RecentNotificationsCard } from "@/feature/notification/components/recent-notifications-card";
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
    <FeedLayout aside={<RecentNotificationsCard />}>
      <div className="pb-6">
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
          showAuthor={false}
          userName={userName}
        />
      </div>
    </FeedLayout>
  );
}
