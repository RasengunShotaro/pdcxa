"use client";

import * as React from "react";
import type { TooltipProps } from "recharts";
import { Legend, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

type ChartConfig = Record<string, { label?: string; color?: string }>;

type ChartContextValue = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextValue | null>(null);

const useChartContext = () => {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("Chart components must be wrapped in <ChartContainer />");
  }
  return context;
};

type ChartContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  config: ChartConfig;
};

function ChartContainer({
  config,
  className,
  children,
  ...props
}: ChartContainerProps) {
  return (
    <ChartContext.Provider value={{ config }}>
      <figure
        className={cn(
          "bg-background text-foreground flex flex-col gap-2 rounded-2xl border p-4",
          className,
        )}
        {...props}
      >
        {children}
      </figure>
    </ChartContext.Provider>
  );
}

const ChartTooltip = Tooltip;

function ChartTooltipContent({
  indicator = "dot",
  ...props
}: TooltipProps<number, string> & { indicator?: "dot" | "line" | "dashed" }) {
  const { active, payload, label } = props;
  const { config } = useChartContext();

  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="bg-background text-foreground grid gap-1 rounded-lg border px-3 py-2 text-xs shadow-md">
      {label ? (
        <p className="text-muted-foreground font-medium">{label}</p>
      ) : null}
      {payload.map((item, index) => {
        const key =
          typeof item.dataKey === "string" ? item.dataKey : String(index);
        const itemConfig = config[key];
        const color = item.color ?? itemConfig?.color;
        return (
          <div className="flex items-center gap-2" key={index}>
            <span
              className={cn("h-2 w-2 rounded-full", {
                "border border-foreground": indicator === "line",
                "border border-dashed border-muted-foreground":
                  indicator === "dashed",
              })}
              style={{ backgroundColor: color }}
            />
            <span className="text-muted-foreground">
              {itemConfig?.label ?? key}
            </span>
            <span className="ml-auto font-semibold">{item.value}</span>
          </div>
        );
      })}
    </div>
  );
}

const ChartLegend = Legend;

function ChartLegendContent({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const { config } = useChartContext();
  return (
    <div className={cn("flex flex-wrap items-center gap-4 text-xs", className)}>
      {Object.entries(config).map(([key, value]) => (
        <div className="flex items-center gap-2" key={key}>
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: value.color }}
          />
          <span className="text-muted-foreground font-medium">
            {value.label ?? key}
          </span>
        </div>
      ))}
    </div>
  );
}

export {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
};
