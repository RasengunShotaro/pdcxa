import { type LucideIcon, Sparkles } from "lucide-react";

export const BADGE_IDS = ["originator"] as const;

export type BadgeId = (typeof BADGE_IDS)[number];

export interface BadgeDefinition {
  readonly label: string;
  readonly description: string;
  readonly icon: LucideIcon;
  readonly className: string;
  readonly iconClassName: string;
}

export const BADGE_CATALOG: Readonly<Record<BadgeId, BadgeDefinition>> = {
  originator: {
    label: "初代様",
    description: "PowerApps 版 PDCXA の作者",
    icon: Sparkles,
    className: "glow-aurora text-teal-800 dark:text-teal-100",
    iconClassName:
      "fill-cyan-200 text-sky-600 dark:fill-cyan-300/50 dark:text-sky-300",
  },
};

const isBadgeId = (value: string): value is BadgeId =>
  BADGE_IDS.some((id) => id === value);

export const 表示するバッジに絞る = (ids: readonly string[]): BadgeId[] => [
  ...new Set(ids.filter(isBadgeId)),
];
