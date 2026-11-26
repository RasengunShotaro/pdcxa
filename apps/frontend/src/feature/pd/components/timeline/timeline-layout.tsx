"use client";

import { useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { FeedSurface } from "@/components/elements/feed-layout";
import type { 一覧と詳細の幅 } from "@/components/elements/feed-layout-cookie";
import { FeedTabPanel } from "@/components/elements/feed-tab-panel";
import {
  一覧に出すタブを決める,
  一覧の持ち主を求める,
  個人の一覧から戻る先のタブを決める,
} from "@/components/elements/nav-items";
import { NotificationsView } from "@/feature/notification/components/notifications-view";
import { notificationsQueryOptions } from "@/feature/notification/hooks/use-notifications";
import { BookmarksView } from "@/feature/pd/components/bookmarks/bookmarks-view";
import { UserTimelineView } from "@/feature/user/components/user-timeline-view";
import { pdListQueryOptions } from "@/hooks/use-pd";
import { HomeView } from "./home-view";

function TimelineList() {
  const pathname = usePathname();
  const [lastTabHref, setLastTabHref] = useState("/");
  const [lastBackHref, setLastBackHref] = useState("/");
  const tabHref = 一覧に出すタブを決める({ pathname, lastTabHref });
  const backHref = 個人の一覧から戻る先のタブを決める({
    pathname,
    lastHref: lastBackHref,
  });

  if (tabHref !== lastTabHref) {
    setLastTabHref(tabHref);
  }
  if (backHref !== lastBackHref) {
    setLastBackHref(backHref);
  }

  const owner = 一覧の持ち主を求める(tabHref);

  return (
    <FeedTabPanel key={tabHref}>
      {tabHref === "/notifications" ? <NotificationsView /> : null}
      {tabHref === "/bookmarks" ? <BookmarksView /> : null}
      {tabHref === "/" ? <HomeView /> : null}
      {owner ? <UserTimelineView backHref={backHref} userName={owner} /> : null}
    </FeedTabPanel>
  );
}

interface TimelineLayoutProps {
  children: ReactNode;
  savedLayout?: 一覧と詳細の幅;
}

export function TimelineLayout({ children, savedLayout }: TimelineLayoutProps) {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.prefetchInfiniteQuery(pdListQueryOptions({}));
    queryClient.prefetchInfiniteQuery(notificationsQueryOptions());
  }, [queryClient]);

  return (
    <FeedSurface list={<TimelineList />} savedLayout={savedLayout}>
      {children}
    </FeedSurface>
  );
}
