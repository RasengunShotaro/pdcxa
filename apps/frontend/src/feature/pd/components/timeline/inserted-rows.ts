export type InsertionPosition = "head" | "anywhere";

interface FindInsertedRowsInput {
  readonly previous: readonly string[] | null;
  readonly next: readonly string[];
  readonly position: InsertionPosition;
}

export function 一覧に新しく入った行を求める({
  previous,
  next,
  position,
}: FindInsertedRowsInput): string[] {
  if (previous === null) {
    return [];
  }

  const known = new Set(previous);
  const firstKnownIndex = next.findIndex((id) => known.has(id));

  if (known.size > 0 && firstKnownIndex === -1) {
    return [];
  }

  if (position === "anywhere") {
    return next.filter((id) => !known.has(id));
  }

  return firstKnownIndex === -1 ? [...next] : next.slice(0, firstKnownIndex);
}
