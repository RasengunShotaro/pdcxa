"use client";

import { ListSkeleton } from "@/components/elements/list-skeleton";
import { useNotifications } from "@/feature/notification/hooks/use-notifications";
import { PdDetailView } from "@/feature/pd/components/detail/pd-detail-view";
import { useBookmarkedPds } from "@/hooks/use-bookmarked-pds";
import { useIsWide } from "@/hooks/use-is-wide";
import { usePd } from "@/hooks/use-pd";

interface FirstPdDetailProps {
  pdId: string | undefined;
  isPending: boolean;
}

function FirstPdDetail({ pdId, isPending }: FirstPdDetailProps) {
  const isWide = useIsWide();

  if (!isWide) return null;
  if (pdId) return <PdDetailView key={pdId} pdId={pdId} />;
  return isPending ? <ListSkeleton count={1} variant="rows" /> : null;
}

export function HomeReadDefault() {
  const { pds, isPending } = usePd({});

  return <FirstPdDetail isPending={isPending} pdId={pds[0]?.id} />;
}

interface UserReadDefaultProps {
  userName: string;
}

export function UserReadDefault({ userName }: UserReadDefaultProps) {
  const { pds, isPending } = usePd({ userName });

  return <FirstPdDetail isPending={isPending} pdId={pds[0]?.id} />;
}

export function BookmarksReadDefault() {
  const { pds, isPending } = useBookmarkedPds();

  return <FirstPdDetail isPending={isPending} pdId={pds[0]?.id} />;
}

export function NotificationsReadDefault() {
  const { notifications, isPending } = useNotifications();

  return <FirstPdDetail isPending={isPending} pdId={notifications[0]?.pdId} />;
}
