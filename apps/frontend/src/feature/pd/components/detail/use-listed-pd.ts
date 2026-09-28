"use client";

import { type InfiniteData, useQueryClient } from "@tanstack/react-query";
import type { Pd } from "@/feature/pd/types";
import {
  type InfinitePds,
  pdDetailQueryFilters,
} from "@/feature/pd/utils/optimistic-update-like";
import { 一覧に読み込み済みのPDを探す } from "./pd-detail-state";

export const useListedPd = (pdId: string): Pd | undefined => {
  const queryClient = useQueryClient();

  return 一覧に読み込み済みのPDを探す({
    cachedLists:
      queryClient.getQueriesData<InfiniteData<InfinitePds>>(
        pdDetailQueryFilters,
      ),
    pdId,
  });
};
