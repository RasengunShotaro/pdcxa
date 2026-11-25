"use client";

import { FeedSectionHeading } from "@/components/elements/feed-layout";
import { ListError } from "@/components/elements/list-error";
import { ListSkeleton } from "@/components/elements/list-skeleton";
import type { RePd } from "@/feature/pd/types";
import { InsertedListItem } from "../timeline/inserted-list-item";
import { useInsertedRowIds } from "../timeline/use-inserted-row-ids";
import { RePdCard } from "./repd-card";

interface RePdSectionProps {
  rePds: RePd[];
  isPending: boolean;
  isError: boolean;
  error: unknown;
  onRetry: () => void;
}

export function RePdSection({
  rePds,
  isPending,
  isError,
  error,
  onRetry,
}: RePdSectionProps) {
  const insertedIds = useInsertedRowIds({
    ids: rePds.map((rePd) => rePd.id),
    isReady: !isPending && !isError,
    position: "anywhere",
  });

  return (
    <section>
      <FeedSectionHeading>
        RePD一覧
        {!isPending && !isError ? (
          <span className="text-[0.875rem] font-normal text-ink-3 tabular-nums">
            {rePds.length}
          </span>
        ) : null}
      </FeedSectionHeading>

      {isPending ? (
        <div className="-mx-5.5">
          <ListSkeleton count={2} variant="rows" />
        </div>
      ) : null}

      {isError ? (
        <div className="py-4">
          <ListError error={error} onRetry={onRetry} />
        </div>
      ) : null}

      {!isPending && !isError && rePds.length === 0 ? (
        <p className="pt-[22px] pb-1.5 text-[0.875rem] text-ink-3">
          まだRePDはありません。RePDしてみよう！
        </p>
      ) : null}

      {!isPending && !isError && rePds.length > 0 ? (
        <ul className="mt-1.5 flex flex-col">
          {rePds.map((rePd) => (
            <InsertedListItem
              isInserted={insertedIds.has(rePd.id)}
              key={rePd.id}
            >
              <RePdCard rePd={rePd} />
            </InsertedListItem>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
