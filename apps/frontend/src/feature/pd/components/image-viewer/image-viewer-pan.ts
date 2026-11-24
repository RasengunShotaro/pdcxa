import type { 大きさ } from "./image-viewer-zoom";

const ドラッグとみなす距離 = 4;

export interface 送り位置 {
  readonly scrollLeft: number;
  readonly scrollTop: number;
}

export interface ポインタの位置 {
  readonly clientX: number;
  readonly clientY: number;
}

export const つかんで動かした後の送り位置を求める = ({
  始めの送り位置,
  押した位置,
  今の位置,
}: {
  readonly 始めの送り位置: 送り位置;
  readonly 押した位置: ポインタの位置;
  readonly 今の位置: ポインタの位置;
}): 送り位置 => ({
  scrollLeft:
    始めの送り位置.scrollLeft - (今の位置.clientX - 押した位置.clientX),
  scrollTop: 始めの送り位置.scrollTop - (今の位置.clientY - 押した位置.clientY),
});

export const ドラッグ操作か = ({
  押した位置,
  今の位置,
}: {
  readonly 押した位置: ポインタの位置;
  readonly 今の位置: ポインタの位置;
}): boolean =>
  Math.hypot(
    今の位置.clientX - 押した位置.clientX,
    今の位置.clientY - 押した位置.clientY,
  ) >= ドラッグとみなす距離;

export const つかんで動かせるか = ({
  中身,
  枠,
}: {
  readonly 中身: 大きさ;
  readonly 枠: 大きさ;
}): boolean => 中身.幅 > 枠.幅 || 中身.高さ > 枠.高さ;
