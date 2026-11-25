"use client";

import { ListError } from "@/components/elements/list-error";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type FootprintLevel,
  あしあとのマスを作る,
} from "@/feature/pd/utils/footprint";
import { useFetchFootprint } from "@/schema/api";
import { FOOTPRINT_LEVEL_CLASS, FootprintGrid } from "./footprint-grid";
import { StatsBlock } from "./stats-block";

const LEGEND_LEVELS: readonly FootprintLevel[] = [0, 1, 2, 3, 4];
const DAYS_ON_NARROW_SCREEN = 18 * 7;

function FootprintLegend() {
  return (
    <span className="flex items-center gap-[3px] text-[0.75rem] text-ink-3">
      <span className="pr-1">少</span>
      {LEGEND_LEVELS.map((level) => (
        <span
          aria-hidden="true"
          className={`size-2.5 rounded-[3px] ${FOOTPRINT_LEVEL_CLASS[level]}`}
          key={level}
        />
      ))}
      <span className="pl-1">多</span>
    </span>
  );
}

export function FootprintHeatmap() {
  const { data, isPending, isError, error, refetch } = useFetchFootprint();
  const cells = data ? あしあとのマスを作る(data.data.days) : [];

  const aside = (
    <span className="flex items-baseline gap-5">
      {data ? (
        <span className="flex items-baseline gap-1.5 text-[0.75rem] text-ink-3">
          <span>連続して動いた日</span>
          <span className="text-[1rem] leading-none font-bold text-ink tabular-nums">
            {data.data.currentStreak}
          </span>
          <span>日</span>
        </span>
      ) : null}
      <FootprintLegend />
    </span>
  );

  return (
    <StatsBlock aside={aside} title="これまでのあしあと">
      {isPending ? (
        <output aria-label="読み込み中" className="block">
          <Skeleton className="h-28 w-full" />
        </output>
      ) : null}

      {isError ? <ListError error={error} onRetry={() => refetch()} /> : null}

      {data ? (
        <>
          <FootprintGrid cells={cells} className="@max-[619px]:hidden" />
          <FootprintGrid
            cells={cells.slice(-DAYS_ON_NARROW_SCREEN)}
            className="@min-[620px]:hidden"
          />
        </>
      ) : null}
    </StatsBlock>
  );
}
