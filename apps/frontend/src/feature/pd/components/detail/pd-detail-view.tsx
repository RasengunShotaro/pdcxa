"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { EmptyState } from "@/components/elements/empty-state";
import { ListError } from "@/components/elements/list-error";
import { ListSkeleton } from "@/components/elements/list-skeleton";
import { Button } from "@/components/ui/button";
import { usePd } from "@/hooks/use-pd";
import { useRePd } from "@/hooks/use-repd";
import { ComposeFab } from "../composer/compose-fab";
import { PdCard } from "../timeline/pd-card";
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
    <div className="space-y-6 pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
      <Link
        className="inline-flex items-center gap-1 text-muted-foreground text-sm transition-colors hover:text-foreground"
        href="/"
      >
        <ChevronLeft aria-hidden="true" className="size-4" />
        ホームへ戻る
      </Link>

      {isPdPending ? <ListSkeleton count={1} /> : null}

      {!isPdPending && isPdError ? (
        <ListError error={pdError} onRetry={() => refetchPd()} />
      ) : null}

      {!isPdPending && !isPdError && !pd ? (
        <EmptyState
          action={backToHome}
          message="指定された PD が見つかりませんでした"
        />
      ) : null}

      {!isPdPending && !isPdError && pd ? (
        <>
          <PdCard pd={pd} />

          <RePdSection
            error={rePdError}
            isError={isRePdError}
            isPending={isRePdPending}
            onRetry={() => refetchRePd()}
            rePds={rePds}
          />

          <ComposeFab label="RePDする" onClick={() => setComposerOpen(true)} />

          <RePdComposer
            isPending={isCreating}
            onOpenChange={setComposerOpen}
            onSubmitRePd={(content) => createRePd(content)}
            open={composerOpen}
          />
        </>
      ) : null}
    </div>
  );
}
