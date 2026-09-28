"use client";

import { useReducedMotionConfig } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export interface BarSeries {
  key: string;
  label: string;
  color: string;
}

export interface ActivityBarChartProps {
  data: Array<Record<string, number | string>>;
  series: BarSeries[];
  xKey: string;
  ariaLabel: string;
  height?: number;
}

const BAR_GROW_DURATION_MS = 300;

export default function ActivityBarChartInner({
  data,
  series,
  xKey,
  ariaLabel,
  height = 280,
}: ActivityBarChartProps) {
  const shouldReduceMotion = useReducedMotionConfig();
  const config: ChartConfig = Object.fromEntries(
    series.map((s) => [s.key, { label: s.label, color: s.color }]),
  );

  return (
    <ChartContainer aria-label={ariaLabel} className="border-0" config={config}>
      <ResponsiveContainer height={height} width="100%">
        <BarChart accessibilityLayer data={data} margin={{ top: 8 }}>
          <CartesianGrid strokeDasharray="4 4" vertical={false} />
          <XAxis
            axisLine={false}
            dataKey={xKey}
            tickLine={false}
            tickMargin={8}
          />
          <YAxis
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            width={28}
          />
          <ChartTooltip
            content={<ChartTooltipContent indicator="dot" />}
            cursor={{ fillOpacity: 0.1 }}
          />
          <ChartLegend content={<ChartLegendContent />} />
          {series.map((s) => (
            <Bar
              animationDuration={BAR_GROW_DURATION_MS}
              animationEasing="ease-out"
              dataKey={s.key}
              fill={s.color}
              isAnimationActive={!shouldReduceMotion}
              key={s.key}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
