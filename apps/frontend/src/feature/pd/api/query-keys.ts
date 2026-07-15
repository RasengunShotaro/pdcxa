import type { QueryKey } from "@tanstack/react-query";
import {
  getFetchPdsQueryKey,
  getFetchRePdsQueryKey,
  getFetchWeeklyStatsQueryKey,
} from "@/schema/api";

const DETAIL = "詳細";

const [PD_ROOT] = getFetchPdsQueryKey();

export const pdDetailQueryKey = (
  params: { pdId?: string; userName?: string } = {},
) => [...getFetchPdsQueryKey(params), DETAIL] as const;

export const isPdDetailQueryKey = (queryKey: QueryKey): boolean =>
  queryKey[0] === PD_ROOT && queryKey[queryKey.length - 1] === DETAIL;

export const pdRootQueryKey = () => getFetchPdsQueryKey();

export const rePdDetailQueryKey = (pdId: string) =>
  [...getFetchRePdsQueryKey({ pdId }), DETAIL] as const;

export const weeklyStatsQueryKey = () => getFetchWeeklyStatsQueryKey();
