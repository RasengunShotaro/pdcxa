import {
  getFetchPdsQueryKey,
  getFetchRePdsQueryKey,
  getFetchWeeklyStatsQueryKey,
} from "@/schema/api";

const DETAIL = "詳細";

export const pdDetailQueryKey = (
  params: { pdId?: string; userName?: string } = {},
) => [...getFetchPdsQueryKey(params), DETAIL] as const;

export const pdRootQueryKey = () => getFetchPdsQueryKey();

export const rePdDetailQueryKey = (pdId: string) =>
  [...getFetchRePdsQueryKey({ pdId }), DETAIL] as const;

export const weeklyStatsQueryKey = () => getFetchWeeklyStatsQueryKey();
