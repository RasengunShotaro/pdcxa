export const ZOOM_MIN = 1;
export const ZOOM_MAX = 5;
const ZOOM_STEP = 0.5;

const 行単位 = 1;
const 画面単位 = 2;
const 一行の高さ = 16;
const 一画面の高さ = 400;
const 画素あたりの拡大の強さ = 0.0015;

export interface 大きさ {
  readonly 幅: number;
  readonly 高さ: number;
}

export type 倍率を変える向き = "拡大" | "縮小";

export const 倍率を範囲に収める = (倍率: number): number =>
  Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, 倍率));

export const 画像を枠に収める大きさを求める = ({
  画像,
  枠,
}: {
  readonly 画像: 大きさ;
  readonly 枠: 大きさ;
}): 大きさ => {
  if (画像.幅 <= 0 || 画像.高さ <= 0) return { 幅: 0, 高さ: 0 };
  const 縮める比 = Math.min(1, 枠.幅 / 画像.幅, 枠.高さ / 画像.高さ);
  return { 幅: 画像.幅 * 縮める比, 高さ: 画像.高さ * 縮める比 };
};

const 送り量を画素にする = ({
  送り量,
  送りの単位,
}: {
  readonly 送り量: number;
  readonly 送りの単位: number;
}): number =>
  送りの単位 === 行単位
    ? 送り量 * 一行の高さ
    : 送りの単位 === 画面単位
      ? 送り量 * 一画面の高さ
      : 送り量;

export const ホイールで変わる倍率を求める = ({
  倍率,
  送り量,
  送りの単位,
}: {
  readonly 倍率: number;
  readonly 送り量: number;
  readonly 送りの単位: number;
}): number =>
  倍率を範囲に収める(
    倍率 *
      Math.exp(
        -送り量を画素にする({ 送り量, 送りの単位 }) * 画素あたりの拡大の強さ,
      ),
  );

export const ボタンで変わる倍率を求める = ({
  倍率,
  向き,
}: {
  readonly 倍率: number;
  readonly 向き: 倍率を変える向き;
}): number =>
  倍率を範囲に収める(向き === "拡大" ? 倍率 + ZOOM_STEP : 倍率 - ZOOM_STEP);

const 中央寄せの余白 = ({
  枠の長さ,
  中身の長さ,
}: {
  readonly 枠の長さ: number;
  readonly 中身の長さ: number;
}): number => Math.max(0, (枠の長さ - 中身の長さ) / 2);

export const 指した点を保つ送り位置を求める = ({
  送り位置,
  指した位置,
  枠の長さ,
  前の中身の長さ,
  次の中身の長さ,
}: {
  readonly 送り位置: number;
  readonly 指した位置: number;
  readonly 枠の長さ: number;
  readonly 前の中身の長さ: number;
  readonly 次の中身の長さ: number;
}): number => {
  if (前の中身の長さ <= 0) return 0;
  const 中身の上の位置 =
    送り位置 +
    指した位置 -
    中央寄せの余白({ 枠の長さ, 中身の長さ: 前の中身の長さ });
  const 拡大後の位置 = 中身の上の位置 * (次の中身の長さ / 前の中身の長さ);
  const 次の送り位置 =
    拡大後の位置 -
    指した位置 +
    中央寄せの余白({ 枠の長さ, 中身の長さ: 次の中身の長さ });
  return Math.min(
    Math.max(0, 次の中身の長さ - 枠の長さ),
    Math.max(0, 次の送り位置),
  );
};
