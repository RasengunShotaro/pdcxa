interface ランキング行の出現の入力 {
  index: number;
  count: number;
}

const STAGGER_SECONDS = 0.05;
const STAGGER_TOTAL_LIMIT_SECONDS = 0.3;

export const ランキング行の出現を遅らせる秒数を決める = ({
  index,
  count,
}: ランキング行の出現の入力): number => {
  const gaps = Math.max(count - 1, 1);
  const step = Math.min(STAGGER_SECONDS, STAGGER_TOTAL_LIMIT_SECONDS / gaps);
  return index * step;
};
