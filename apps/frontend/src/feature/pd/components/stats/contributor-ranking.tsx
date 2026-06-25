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

type RankingRow = PdWeeklyStatsDetailed["rankings"][number];

interface ContributorRankingProps {
  rankings: RankingRow[];
}

const RANK_BADGE: Record<number, string> = {
  1: "bg-amber-100 text-amber-700",
  2: "bg-slate-200 text-slate-600",
  3: "bg-orange-100 text-orange-700",
};

const displayNameOf = (row: RankingRow): string => {
  if (row.displayName.trim().length > 0) {
    return row.displayName;
  }
  if (row.userName.trim().length > 0) {
    return `@${row.userName}`;
  }
  return "名称未設定";
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

function ContributorIdentity({ row }: { row: RankingRow }) {
  const name = displayNameOf(row);
  const identity = (
    <>
      <Avatar className="size-10">
        <AvatarImage alt="" src={row.imageUrl} />
        <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
          {avatarInitials(name)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate font-semibold leading-tight text-foreground">
          {name}
        </p>
        {row.userName ? (
          <p className="truncate text-sm leading-tight text-muted-foreground">
            @{row.userName}
          </p>
        ) : null}
      </div>
    </>
  );

  if (!row.userName) {
    return <div className="flex min-w-0 items-center gap-3">{identity}</div>;
  }

  return (
    <Link
      className="flex min-w-0 items-center gap-3 rounded-lg transition-[color,transform] hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      href={`/user/${row.userName}`}
    >
      {identity}
    </Link>
  );
}

export function ContributorRanking({ rankings }: ContributorRankingProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">投稿ランキング</CardTitle>
        <CardDescription>PD 投稿数の多い順</CardDescription>
      </CardHeader>
      <CardContent>
        {rankings.length === 0 ? (
          <EmptyState message="今週はまだ投稿者がいません" />
        ) : (
          <ol className="space-y-4">
            {rankings.map((row, index) => (
              <li className="flex items-center gap-3" key={row.userId}>
                <RankBadge rank={index + 1} />
                <ContributorIdentity row={row} />
                <div className="ml-auto shrink-0 text-right">
                  <p className="font-semibold tabular-nums text-foreground">
                    {row.pdCount} PD
                  </p>
                  <p className="text-xs text-muted-foreground tabular-nums">
                    いいね {row.likeCount} / RePD {row.rePdCount}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
