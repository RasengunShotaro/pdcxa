"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { EmptyState } from "@/components/elements/empty-state";
import { FeedLayout } from "@/components/elements/feed-layout";
import { ListError } from "@/components/elements/list-error";
import { ListSkeleton } from "@/components/elements/list-skeleton";
import { Button } from "@/components/ui/button";
import { WeeklyActivityCard } from "@/feature/pd/components/stats/weekly-activity-card";
import { usePd } from "@/hooks/use-pd";
import { useRePd } from "@/hooks/use-repd";
import { ComposeFab } from "../composer/compose-fab";
import { PdCard } from "../timeline/pd-card";
import { BackLink } from "./back-link";
import { PD詳細の表示状態を決める } from "./pd-detail-state";
import { RePdComposer } from "./repd-composer";
import { RePdSection } from "./repd-section";
import { useListedPd } from "./use-listed-pd";

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
  const listedPd = useListedPd(pdId);
  const state = PD詳細の表示状態を決める({
    fetchedPd: pds[0],
    cachedPd: listedPd,
    isPending: isPdPending,
    isError: isPdError,
  });

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
    <FeedLayout aside={<WeeklyActivityCard />} leading={<BackLink />}>
      <div className="pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
        {state.kind === "loading" ? (
          <ListSkeleton count={1} variant="rows" />
        ) : null}

        {state.kind === "error" ? (
          <div className="p-4">
            <ListError error={pdError} onRetry={() => refetchPd()} />
          </div>
        ) : null}

        {state.kind === "notFound" ? (
          <EmptyState
            action={backToHome}
            message="指定されたPDが見つかりませんでした"
          />
        ) : null}

        {state.kind === "ready" ? (
          <>
            <div className="border-b border-border">
              <PdCard clampBody={false} pd={state.pd} />
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
