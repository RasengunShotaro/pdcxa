import Link from "next/link";
import { EmptyState } from "@/components/elements/empty-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { avatarInitials } from "@/feature/pd/components/timeline/avatar-initials";
import type { PdWeeklyStatsDetailed } from "@/feature/pd/types/stats";
import {
  投稿者の表示名,
  最多に対する割合を求める,
} from "@/feature/pd/utils/stats-derive";
import { ランキング行の出現を遅らせる秒数を決める } from "./ranking-reveal";
import { StatsBlock } from "./stats-block";

type RankingRow = PdWeeklyStatsDetailed["rankings"][number];

interface ContributorRankingProps {
  rankings: RankingRow[];
}

interface ContributorRowProps {
  row: RankingRow;
  rank: number;
  share: number;
}

function ContributorRow({ row, rank, share }: ContributorRowProps) {
  const name = 投稿者の表示名(row);
  const content = (
    <>
      <span
        aria-hidden="true"
        className="w-5 shrink-0 text-center text-[0.8125rem] font-bold text-ink-3 tabular-nums"
      >
        {rank}
      </span>
      <Avatar className="size-8 shrink-0">
        <AvatarImage alt="" src={row.imageUrl} />
        <AvatarFallback className="bg-brand-soft text-xs font-bold text-ink">
          {avatarInitials(name)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.9063rem] leading-snug font-bold text-ink">
          {name}
        </p>
        <p className="flex min-w-0 flex-wrap gap-x-1.5 text-[0.75rem] leading-snug text-ink-3">
          {row.userName ? (
            <span className="max-w-full truncate">@{row.userName}</span>
          ) : null}
          <span className="shrink-0 tabular-nums">
            いいね{row.likeCount}件 / RePD{row.rePdCount}件
          </span>
        </p>
        <span
          aria-hidden="true"
          className="mt-1.5 block h-1 overflow-hidden rounded-full bg-fill"
        >
          <span
            className="block h-full rounded-full bg-brand"
            style={{ width: `${share}%` }}
          />
        </span>
      </div>
      <p className="shrink-0 text-[0.8125rem] text-ink-2 tabular-nums">
        {row.pdCount} PD
      </p>
    </>
  );

  const rowClassName = "flex items-center gap-3 rounded-xl px-2 py-[9px]";

  if (!row.userName) {
    return <div className={rowClassName}>{content}</div>;
  }

  return (
    <Link
      className={`${rowClassName} transition-[background-color,translate] hover:-translate-y-px hover:bg-fill focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50`}
      href={`/user/${row.userName}`}
    >
      {content}
    </Link>
  );
}

export function ContributorRanking({ rankings }: ContributorRankingProps) {
  return (
    <StatsBlock description="PD投稿数の多い順" title="投稿ランキング">
      {rankings.length === 0 ? (
        <EmptyState message="今週はまだ投稿者がいません" />
      ) : (
        <ol className="-mx-2 divide-y divide-line">
          {rankings.map((row, index) => (
            <li
              className="animate-in fade-in slide-in-from-top-1 duration-200 ease-out fill-mode-backwards"
              key={row.userId}
              style={{
                animationDelay: `${ランキング行の出現を遅らせる秒数を決める({
                  index,
                  count: rankings.length,
                })}s`,
              }}
            >
              <ContributorRow
                rank={index + 1}
                row={row}
                share={最多に対する割合を求める({
                  value: row.pdCount,
                  max: Math.max(...rankings.map((entry) => entry.pdCount)),
                })}
              />
            </li>
          ))}
        </ol>
      )}
    </StatsBlock>
  );
}
