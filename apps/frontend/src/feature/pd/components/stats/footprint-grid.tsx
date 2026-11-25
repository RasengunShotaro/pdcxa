"use client";

import { type KeyboardEvent, useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  type FootprintCell,
  あしあとの件数を表す,
  あしあとの日付を表す,
  あしあとを週ごとに並べる,
  目盛りに出す曜日,
  矢印キーで移る日を決める,
} from "@/feature/pd/utils/footprint";
import { cn } from "@/lib/utils";
import { FOOTPRINT_LEVEL_CLASS } from "./footprint-level-class";

const AXIS_CLASS = "text-[0.6875rem] leading-none text-ink-3";

interface FootprintGridProps {
  cells: readonly FootprintCell[];
  className?: string;
}

export function FootprintGrid({ cells, className }: FootprintGridProps) {
  const calendar = あしあとを週ごとに並べる(cells);
  const [activeIndex, setActiveIndex] = useState(cells.length - 1);
  const gridRef = useRef<HTMLDivElement>(null);

  const moveFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    const next = 矢印キーで移る日を決める({
      index: activeIndex,
      key: event.key,
      count: cells.length,
    });
    if (next === activeIndex) return;
    event.preventDefault();
    setActiveIndex(next);
    gridRef.current
      ?.querySelector<HTMLElement>(`[data-day-index="${next}"]`)
      ?.focus();
  };

  return (
    // biome-ignore lint/a11y/useSemanticElements: 日ごとのマスを矢印キーで行き来する 1 つのまとまりで、fieldset の見た目と意味は合わない
    <div
      aria-label="これまでのあしあと"
      className={cn("grid gap-[3px]", className)}
      onKeyDown={moveFocus}
      ref={gridRef}
      role="group"
      style={{
        gridTemplateColumns: `auto repeat(${calendar.columnCount}, minmax(0, 1fr))`,
      }}
    >
      {calendar.months.map((month) => (
        <span
          aria-hidden="true"
          className={cn(AXIS_CLASS, "pb-1 whitespace-nowrap")}
          key={`${month.column}-${month.label}`}
          style={{ gridColumn: `${month.column + 2} / span 3`, gridRow: 1 }}
        >
          {month.label}
        </span>
      ))}
      {目盛りに出す曜日.map((weekday) => (
        <span
          aria-hidden="true"
          className={cn(AXIS_CLASS, "self-center pr-1.5")}
          key={weekday.label}
          style={{ gridColumn: 1, gridRow: weekday.row + 2 }}
        >
          {weekday.label}
        </span>
      ))}
      {calendar.cells.map((cell, index) => {
        const date = あしあとの日付を表す(cell.date);
        const counts = あしあとの件数を表す(cell);
        return (
          <Tooltip key={cell.date}>
            <TooltipTrigger asChild>
              <button
                aria-label={`${date} ${counts}`}
                className={cn(
                  "aspect-square cursor-default rounded-[5px] outline-none focus-visible:ring-2 focus-visible:ring-ink",
                  FOOTPRINT_LEVEL_CLASS[cell.level],
                )}
                data-day-index={index}
                onFocus={() => setActiveIndex(index)}
                style={{ gridColumn: cell.column + 2, gridRow: cell.row + 2 }}
                tabIndex={index === activeIndex ? 0 : -1}
                type="button"
              />
            </TooltipTrigger>
            <TooltipContent sideOffset={4}>
              <span className="block font-bold">{date}</span>
              <span className="block">{counts}</span>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
