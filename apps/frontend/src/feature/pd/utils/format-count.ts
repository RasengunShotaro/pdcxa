const compactFormatter = new Intl.NumberFormat("ja-JP", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export const 件数を短く表す = (count: number): string =>
  count < 10000 ? String(count) : compactFormatter.format(count);
