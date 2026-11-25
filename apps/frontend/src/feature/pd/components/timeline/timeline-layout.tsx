"use client";

import { useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { FeedSurface } from "@/components/elements/feed-layout";
import { FeedTabPanel } from "@/components/elements/feed-tab-panel";
import { 一覧に出すタブを決める } from "@/components/elements/nav-items";
import { NotificationsView } from "@/feature/notification/components/notifications-view";
import { notificationsQueryOptions } from "@/feature/notification/hooks/use-notifications";
import { BookmarksView } from "@/feature/pd/components/bookmarks/bookmarks-view";
import { pdListQueryOptions } from "@/hooks/use-pd";
import { HomeView } from "./home-view";

function TimelineList() {
  const pathname = usePathname();
  const [lastTabHref, setLastTabHref] = useState("/");
  const tabHref = 一覧に出すタブを決める({ pathname, lastTabHref });

  if (tabHref !== lastTabHref) {
    setLastTabHref(tabHref);
  }

  return (
    <FeedTabPanel key={tabHref}>
      {tabHref === "/notifications" ? <NotificationsView /> : null}
      {tabHref === "/bookmarks" ? <BookmarksView /> : null}
      {tabHref === "/" ? <HomeView /> : null}
    </FeedTabPanel>
  );
}

interface TimelineLayoutProps {
  children: ReactNode;
}

export function TimelineLayout({ children }: TimelineLayoutProps) {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.prefetchInfiniteQuery(pdListQueryOptions({}));
    queryClient.prefetchInfiniteQuery(notificationsQueryOptions());
  }, [queryClient]);

  return <FeedSurface list={<TimelineList />}>{children}</FeedSurface>;
}
