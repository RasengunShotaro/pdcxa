import type { QueryKey } from "@tanstack/react-query";
import {
  pdRootQueryKey,
  weeklyStatsQueryKey,
} from "@/feature/pd/api/query-keys";
import {
  getFetchNotificationsQueryKey,
  getFetchRePdsQueryKey,
} from "@/schema/api";

export const handleDependentQueryKeys = (): readonly QueryKey[] => [
  pdRootQueryKey(),
  getFetchRePdsQueryKey(),
  weeklyStatsQueryKey(),
  getFetchNotificationsQueryKey(),
];
