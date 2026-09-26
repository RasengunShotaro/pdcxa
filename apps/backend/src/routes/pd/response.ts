import type { PdDetail } from "#/domain/pd/types";

export const PDをレスポンス形式にする = (pd: PdDetail) => ({
  ...pd,
  createdAt: pd.createdAt.toISOString(),
  quotedPd: pd.quotedPd
    ? { ...pd.quotedPd, createdAt: pd.quotedPd.createdAt.toISOString() }
    : null,
});
