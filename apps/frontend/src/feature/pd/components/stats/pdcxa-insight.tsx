"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { PdWeeklyStatsDetailed } from "../../types";

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  month: "numeric",
  day: "numeric",
  weekday: "short",
});

const chartConfig = {
  pdCount: {
    label: "PD",
    color: "var(--chart-9)",
  },
  rePdCount: {
    label: "RePD",
    color: "var(--chart-7)",
  },
  likeCount: {
    label: "いいね",
    color: "var(--chart-8)",
  },
} as const;

const 画像に不透明度情報を追加する = (color: string, 不透明度: number) =>
  `color-mix(in oklch, ${color} ${不透明度 * 100}%, transparent)`;

export const PDCXAInsight = ({ stats }: { stats: PdWeeklyStatsDetailed }) => {
  const 週次PDCXA統計 = stats.daily.map((entry) => ({
    ...entry,
    label: dateFormatter.format(new Date(entry.date)),
  }));
  const rankings = stats.rankings;
  const 一日あたりのPD = Number(
    (stats.totals.pdCount / 週次PDCXA統計.length).toFixed(1),
  );

  const PDあたりのいいね = Number(
    (stats.totals.likeCount / stats.totals.pdCount).toFixed(1),
  );
  const PDあたりのRePD = Number(
    (stats.totals.rePdCount / stats.totals.pdCount).toFixed(1),
  );

  const summaryItems = [
    {
      title: "PD投稿数",
      value: stats.totals.pdCount,
      description: `1日平均 ${一日あたりのPD} 件`,
    },
    {
      title: "総いいね",
      value: stats.totals.likeCount,
      description: `1PDあたり ${PDあたりのいいね} 件`,
    },
    {
      title: "RePD数",
      value: stats.totals.rePdCount,
      description: `1PDあたり ${PDあたりのRePD} 件`,
    },
    {
      title: "アクティブ投稿者",
      value: stats.totals.activeAuthorCount,
      description: `平均 ${stats.totals.averagePdPerAuthor} 件/人`,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {summaryItems.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                {item.title}
              </CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card className="space-y-2">
          <CardHeader>
            <CardTitle>投稿量と反応</CardTitle>
          </CardHeader>
          <CardContent className="px-1">
            <ChartContainer className="border-0" config={chartConfig}>
              <ResponsiveContainer height={320} width="100%">
                <AreaChart
                  data={週次PDCXA統計}
                  margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
                >
                  <CartesianGrid strokeDasharray="4 4" vertical={false} />
                  <XAxis
                    axisLine={false}
                    dataKey="label"
                    tickLine={false}
                    tickMargin={12}
                  />
                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent indicator="line" />}
                    cursor={{ strokeDasharray: "4 4" }}
                  />
                  <Area
                    dataKey="pdCount"
                    fill={画像に不透明度情報を追加する(
                      chartConfig.pdCount.color,
                      0.3,
                    )}
                    stroke={chartConfig.pdCount.color}
                    strokeWidth={2.4}
                    type="monotone"
                  />
                  <Area
                    dataKey="rePdCount"
                    fill={画像に不透明度情報を追加する(
                      chartConfig.rePdCount.color,
                      0.28,
                    )}
                    stroke={chartConfig.rePdCount.color}
                    strokeWidth={2.4}
                    type="monotone"
                  />
                  <Area
                    dataKey="likeCount"
                    fill={画像に不透明度情報を追加する(
                      chartConfig.likeCount.color,
                      0.22,
                    )}
                    stroke={chartConfig.likeCount.color}
                    strokeWidth={2.4}
                    type="monotone"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="space-y-2">
          <CardHeader>
            <CardTitle>PD件数ランキング</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rankings.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  データがありません。
                </p>
              ) : (
                rankings.map((entry, index) => (
                  <div
                    className="flex justify-between gap-4"
                    key={entry.userId}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold text-muted-foreground">
                        {index + 1}
                      </span>
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          alt={entry.displayName}
                          src={entry.imageUrl}
                        />
                      </Avatar>
                      <div>
                        <p className="font-semibold">{entry.displayName}</p>
                        <p className="text-muted-foreground text-xs">
                          {entry.userName ? `@${entry.userName}` : entry.userId}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <p className="text-base font-semibold text-foreground">
                        {entry.pdCount} PD
                      </p>
                      <p>
                        いいね {entry.likeCount} / RePD {entry.rePdCount}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
