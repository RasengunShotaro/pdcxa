export type CountDirection = "up" | "down" | "none";

interface DecideCountDirectionInput {
  previous: number | undefined;
  next: number;
}

export function 件数の変化の向きを決める({
  previous,
  next,
}: DecideCountDirectionInput): CountDirection {
  if (previous === undefined || previous === next) {
    return "none";
  }
  return next > previous ? "up" : "down";
}
