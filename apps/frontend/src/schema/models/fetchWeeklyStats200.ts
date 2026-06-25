import type { FetchWeeklyStats200DailyItem } from './fetchWeeklyStats200DailyItem';
import type { FetchWeeklyStats200Range } from './fetchWeeklyStats200Range';
import type { FetchWeeklyStats200RankingsItem } from './fetchWeeklyStats200RankingsItem';
import type { FetchWeeklyStats200Totals } from './fetchWeeklyStats200Totals';

export type FetchWeeklyStats200 = {
  range: FetchWeeklyStats200Range;
  totals: FetchWeeklyStats200Totals;
  daily: FetchWeeklyStats200DailyItem[];
  rankings: FetchWeeklyStats200RankingsItem[];
};
