"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { EmptyState } from "@/components/elements/empty-state";
import { FeedLayout } from "@/components/elements/feed-layout";
import { ListError } from "@/components/elements/list-error";
import { ListSkeleton } from "@/components/elements/list-skeleton";
import { Button } from "@/components/ui/button";
import { RecentNotificationsCard } from "@/feature/notification/components/recent-notifications-card";
import { usePd } from "@/hooks/use-pd";
import { useRePd } from "@/hooks/use-repd";
import { ComposeFab } from "../composer/compose-fab";
import { PdCard } from "../timeline/pd-card";
import { BackLink } from "./back-link";
import { RePdComposer } from "./repd-composer";
import { RePdSection } from "./repd-section";

interface PdDetailViewProps {
  pdId: string;
}

const backToHome = (
  <Button asChild variant="outline">
    <Link href="/">
      <ChevronLeft aria-hidden="true" className="size-4" />
      ホームへ戻る
    </Link>
  </Button>
);

export function PdDetailView({ pdId }: PdDetailViewProps) {
  const [composerOpen, setComposerOpen] = useState(false);

  const {
    pds,
    isPending: isPdPending,
    isError: isPdError,
    error: pdError,
    refetch: refetchPd,
  } = usePd({ pdId });
  const pd = pds[0];

  const {
    rePds,
    isPending: isRePdPending,
    isError: isRePdError,
    error: rePdError,
    refetch: refetchRePd,
    createRePd,
    isCreating,
  } = useRePd(pdId);

  return (
    <FeedLayout aside={<RecentNotificationsCard />}>
      <div className="pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
        <div className="flex h-12 items-center border-b border-border px-4">
          <BackLink />
        </div>

        {isPdPending ? <ListSkeleton count={1} variant="rows" /> : null}

        {!isPdPending && isPdError ? (
          <div className="p-4">
            <ListError error={pdError} onRetry={() => refetchPd()} />
          </div>
        ) : null}

        {!isPdPending && !isPdError && !pd ? (
          <EmptyState
            action={backToHome}
            message="指定されたPDが見つかりませんでした"
          />
        ) : null}

        {!isPdPending && !isPdError && pd ? (
          <>
            <div className="border-b border-border">
              <PdCard pd={pd} />
            </div>

            <RePdSection
              error={rePdError}
              isError={isRePdError}
              isPending={isRePdPending}
              onRetry={() => refetchRePd()}
              rePds={rePds}
            />

            <ComposeFab
              label="RePDする"
              onClick={() => setComposerOpen(true)}
            />

            <RePdComposer
              isPending={isCreating}
              onOpenChange={setComposerOpen}
              onSubmitRePd={(content) => createRePd(content)}
              open={composerOpen}
            />
          </>
        ) : null}
      </div>
    </FeedLayout>
  );
}
