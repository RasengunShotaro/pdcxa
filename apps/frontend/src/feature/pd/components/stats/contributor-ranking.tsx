import Link from "next/link";
import { EmptyState } from "@/components/elements/empty-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { avatarInitials } from "@/feature/pd/components/timeline/avatar-initials";
import type { PdWeeklyStatsDetailed } from "@/feature/pd/types/stats";
import { 投稿者の表示名 } from "@/feature/pd/utils/stats-derive";

type RankingRow = PdWeeklyStatsDetailed["rankings"][number];

interface ContributorRankingProps {
  rankings: RankingRow[];
}

const RANK_BADGE: Record<number, string> = {
  1: "bg-amber-100 text-amber-700",
  2: "bg-slate-200 text-slate-600",
  3: "bg-orange-100 text-orange-700",
};

function RankBadge({ rank }: { rank: number }) {
  const className = RANK_BADGE[rank] ?? "bg-transparent text-muted-foreground";
  return (
    <span
      aria-hidden="true"
      className={`flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-bold tabular-nums ${className}`}
    >
      {rank}
    </span>
  );
}

function ContributorRow({ row, rank }: { row: RankingRow; rank: number }) {
  const name = 投稿者の表示名(row);
  const content = (
    <>
      <RankBadge rank={rank} />
      <Avatar className="size-10 shrink-0">
        <AvatarImage alt="" src={row.imageUrl} />
        <AvatarFallback className="bg-primary-50 text-sm font-medium text-primary-600 dark:bg-primary/15 dark:text-primary-300">
          {avatarInitials(name)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold leading-snug text-foreground">
          {name}
        </p>
        <p className="flex min-w-0 flex-wrap gap-x-1.5 text-xs leading-snug text-muted-foreground">
          {row.userName ? (
            <span className="max-w-full truncate">@{row.userName}</span>
          ) : null}
          <span className="shrink-0 tabular-nums">
            いいね{row.likeCount}件 / RePD{row.rePdCount}件
          </span>
        </p>
      </div>
      <p className="shrink-0 font-semibold tabular-nums text-foreground">
        {row.pdCount} PD
      </p>
    </>
  );

  const rowClassName = "flex items-center gap-3 rounded-lg px-2 py-2";

  if (!row.userName) {
    return <div className={rowClassName}>{content}</div>;
  }

  return (
    <Link
      className={`${rowClassName} transition-[background-color,translate] hover:-translate-y-px hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50`}
      href={`/user/${row.userName}`}
    >
      {content}
    </Link>
  );
}

export function ContributorRanking({ rankings }: ContributorRankingProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">投稿ランキング</CardTitle>
        <CardDescription>PD投稿数の多い順</CardDescription>
      </CardHeader>
      <CardContent>
        {rankings.length === 0 ? (
          <EmptyState message="今週はまだ投稿者がいません" />
        ) : (
          <ol className="-mx-2 space-y-1">
            {rankings.map((row, index) => (
              <li key={row.userId}>
                <ContributorRow rank={index + 1} row={row} />
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
