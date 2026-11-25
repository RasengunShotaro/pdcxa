import type { FetchFootprint200DaysItem } from './fetchFootprint200DaysItem';
import type { FetchFootprint200Range } from './fetchFootprint200Range';

export type FetchFootprint200 = {
  range: FetchFootprint200Range;
  days: FetchFootprint200DaysItem[];
  currentStreak: number;
};
