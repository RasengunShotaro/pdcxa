import type { Pd } from "@/feature/pd/types";
import type { PdDetailSnapshot } from "@/feature/pd/utils/optimistic-update-like";

export type PdDetailState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "notFound" }
  | { kind: "ready"; pd: Pd };

export const 一覧に読み込み済みのPDを探す = ({
  cachedLists,
  pdId,
}: {
  cachedLists: PdDetailSnapshot;
  pdId: string;
}): Pd | undefined =>
  cachedLists
    .flatMap(([, data]) => data?.pages ?? [])
    .flatMap((page) => page.items)
    .find((pd) => pd.id === pdId);

export const PD詳細の表示状態を決める = ({
  fetchedPd,
  cachedPd,
  isPending,
  isError,
}: {
  fetchedPd: Pd | undefined;
  cachedPd: Pd | undefined;
  isPending: boolean;
  isError: boolean;
}): PdDetailState => {
  if (isPending) {
    return cachedPd ? { kind: "ready", pd: cachedPd } : { kind: "loading" };
  }
  if (isError) return { kind: "error" };
  return fetchedPd ? { kind: "ready", pd: fetchedPd } : { kind: "notFound" };
};
