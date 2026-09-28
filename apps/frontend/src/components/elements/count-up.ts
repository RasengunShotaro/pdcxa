interface カウントアップ途中の表示値の入力 {
  latest: number;
  target: number;
}

const 小数の桁数 = (value: number): number => {
  const [, fraction = ""] = String(value).split(".");
  return fraction.length;
};

export const カウントアップ途中の表示値を決める = ({
  latest,
  target,
}: カウントアップ途中の表示値の入力): number => {
  const scale = 10 ** 小数の桁数(target);
  const rounded = Math.round(latest * scale) / scale;
  return Math.min(Math.max(rounded, 0), target);
};
