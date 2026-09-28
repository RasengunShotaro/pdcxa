"use client";

import { useQueryClient } from "@tanstack/react-query";
import { type ReactNode, useEffect } from "react";
import { FeedLayout } from "@/components/elements/feed-layout";
import { TIMELINE_TABS } from "@/components/elements/nav-items";
import { notificationsQueryOptions } from "@/feature/notification/hooks/use-notifications";
import { WeeklyActivityCard } from "@/feature/pd/components/stats/weekly-activity-card";
import { pdListQueryOptions } from "@/hooks/use-pd";

interface TimelineLayoutProps {
  children: ReactNode;
}

export function TimelineLayout({ children }: TimelineLayoutProps) {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.prefetchInfiniteQuery(pdListQueryOptions({}));
    queryClient.prefetchInfiniteQuery(notificationsQueryOptions());
  }, [queryClient]);

  return (
    <FeedLayout aside={<WeeklyActivityCard />} tabs={TIMELINE_TABS}>
      {children}
    </FeedLayout>
  );
}
