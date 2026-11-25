"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/elements/empty-state";
import { ListError } from "@/components/elements/list-error";
import { ListSkeleton } from "@/components/elements/list-skeleton";
import { Button } from "@/components/ui/button";
import { usePd } from "@/hooks/use-pd";
import { useRePd } from "@/hooks/use-repd";
import { PdDetailCard } from "./pd-detail-card";
import { PD詳細の表示状態を決める } from "./pd-detail-state";
import { RePdComposer } from "./repd-composer";
import { RePdSection } from "./repd-section";
import { useListedPd } from "./use-listed-pd";

interface PdDetailViewProps {
  pdId: string;
}

const backToHome = (
  <Button asChild className="rounded-full" variant="outline">
    <Link href="/">
      <ChevronLeft aria-hidden="true" className="size-4" />
      ホームへ戻る
    </Link>
  </Button>
);

export function PdDetailView({ pdId }: PdDetailViewProps) {
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
    <div className="flex flex-1 flex-col">
      {state.kind === "loading" ? (
        <div className="-mx-5.5">
          <ListSkeleton count={1} variant="rows" />
        </div>
      ) : null}

      {state.kind === "error" ? (
        <ListError error={pdError} onRetry={() => refetchPd()} />
      ) : null}

      {state.kind === "notFound" ? (
        <EmptyState
          action={backToHome}
          message="指定されたPDが見つかりませんでした"
        />
      ) : null}

      {state.kind === "ready" ? (
        <>
          <div className="flex-1 pb-6">
            <PdDetailCard pd={state.pd} />

            <RePdSection
              error={rePdError}
              isError={isRePdError}
              isPending={isRePdPending}
              onRetry={() => refetchRePd()}
              rePds={rePds}
            />
          </div>

          <RePdComposer
            isPending={isCreating}
            onSubmitRePd={(content) => createRePd(content)}
          />
        </>
      ) : null}
    </div>
  );
}
